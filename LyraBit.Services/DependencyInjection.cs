using LyraBit.Services.Auth;
using LyraBit.Services.Fraud;
using LyraBit.Services.Settings;
using LyraBit.Services.Transactions;
using LyraBit.Services.Wallets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LyraBit.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddServiceLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.Configure<FraudDetectionSettings>(configuration.GetSection(FraudDetectionSettings.SectionName));

        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IWalletService, WalletService>();
        services.AddScoped<IFraudDetectionService, FraudDetectionService>();
        services.AddScoped<ITransactionService, TransactionService>();

        return services;
    }
}
