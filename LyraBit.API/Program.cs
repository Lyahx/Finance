using System.Text;
using System.Text.Json.Serialization;
using LyraBit.API.Middleware;
using LyraBit.Data;
using LyraBit.Services;
using LyraBit.Services.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

const string CorsPolicy = "LyraBitOpen";

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection or DATABASE_URL is missing.");
connectionString = NormalizePostgresConnectionString(connectionString);
builder.Services.AddDataLayer(connectionString);
builder.Services.AddServiceLayer(builder.Configuration);

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("Jwt section is missing in configuration.");
if (string.IsNullOrWhiteSpace(jwtSettings.Key) || jwtSettings.Key.Length < 32)
{
    throw new InvalidOperationException("Jwt:Key must be at least 32 characters long.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.MapInboundClaims = false;
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
            ClockSkew = TimeSpan.FromSeconds(30),
            NameClaimType = "username",
            RoleClaimType = "role"
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(opt => opt.AddPolicy(CorsPolicy, policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LyraBitDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Applying database migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Seeding data...");
        await SeedData.SeedAsync(db);
        logger.LogInformation("Database is ready.");
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Database initialization failed.");
        throw;
    }
}

app.UseCors(CorsPolicy);

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Postgres URI formatını (Railway DATABASE_URL) Npgsql key=value formatına çevirir.
// Standart key=value zaten verilmişse olduğu gibi döner.
static string NormalizePostgresConnectionString(string raw)
{
    if (string.IsNullOrWhiteSpace(raw))
    {
        return raw;
    }

    if (!raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return raw;
    }

    var uri = new Uri(raw);
    var userInfo = uri.UserInfo.Split(':', 2);
    var user = Uri.UnescapeDataString(userInfo[0]);
    var pass = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
    var db = uri.AbsolutePath.TrimStart('/');

    return $"Host={uri.Host};Port={(uri.Port > 0 ? uri.Port : 5432)};Database={db};" +
           $"Username={user};Password={pass};SSL Mode=Require;Trust Server Certificate=true";
}
