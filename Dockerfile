# syntax=docker/dockerfile:1

# ========== Build ==========
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Layer-cache restore: önce csproj'lar
COPY ["LyraBit.API/LyraBit.API.csproj",      "LyraBit.API/"]
COPY ["LyraBit.Services/LyraBit.Services.csproj", "LyraBit.Services/"]
COPY ["LyraBit.Data/LyraBit.Data.csproj",    "LyraBit.Data/"]
COPY ["LyraBit.Core/LyraBit.Core.csproj",    "LyraBit.Core/"]
RUN dotnet restore "LyraBit.API/LyraBit.API.csproj"

# Sonra tüm kaynak
COPY . .
WORKDIR /src/LyraBit.API
RUN dotnet publish "LyraBit.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# ========== Runtime ==========
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_USE_POLLING_FILE_WATCHER=false \
    ASPNETCORE_ENVIRONMENT=Production

# Default port — Railway PORT env'i varsa onu kullanır
EXPOSE 8080

# shell form: $PORT env expansion için gerekli (Railway dynamic port atar)
ENTRYPOINT ["sh", "-c", "ASPNETCORE_HTTP_PORTS=${PORT:-8080} dotnet LyraBit.API.dll"]
