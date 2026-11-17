FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

USER root
RUN mkdir -p /app/wwwroot /logs \
    && chown -R app:app /app /logs

USER $APP_UID
EXPOSE 8080


FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Presentation/Presentation.csproj", "Presentation/"]
COPY ["WebApi/WebApi.csproj", "WebApi/"]

RUN dotnet restore "WebApi/WebApi.csproj"

COPY . .


FROM build AS publish
RUN dotnet publish "WebApi/WebApi.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM build AS migrations

RUN dotnet tool install \
    --tool-path /tools \
    dotnet-ef \
    --version 10.0.12

ENTRYPOINT ["/tools/dotnet-ef"]

FROM base AS final
WORKDIR /app

COPY --from=publish --chown=app:app /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "WebApi.dll"]