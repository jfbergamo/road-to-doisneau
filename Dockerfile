FROM mcr.microsoft.com/dotnet/sdk:10.0 AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["RoadToDoisneau.Backend/RoadToDoisneau.Backend.csproj", "RoadToDoisneau.Backend/"]
RUN dotnet restore "./RoadToDoisneau.Backend/RoadToDoisneau.Backend.csproj"
COPY . .
WORKDIR "/src/RoadToDoisneau.Backend"
COPY RoadToDoisneau.Frontend/ ./wwwroot/
RUN dotnet publish "./RoadToDoisneau.Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
USER $APP_UID
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RoadToDoisneau.Backend.dll"]