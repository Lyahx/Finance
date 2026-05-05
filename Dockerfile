FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["LyraBit.API/LyraBit.API.csproj", "LyraBit.API/"]
COPY ["LyraBit.Services/LyraBit.Services.csproj", "LyraBit.Services/"]
COPY ["LyraBit.Data/LyraBit.Data.csproj", "LyraBit.Data/"]
COPY ["LyraBit.Core/LyraBit.Core.csproj", "LyraBit.Core/"]
RUN dotnet restore "LyraBit.API/LyraBit.API.csproj"

COPY . .
WORKDIR /src/LyraBit.API
RUN dotnet publish "LyraBit.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 8080

ENTRYPOINT ["dotnet", "LyraBit.API.dll"]
