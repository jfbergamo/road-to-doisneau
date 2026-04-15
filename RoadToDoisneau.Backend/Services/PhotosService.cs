using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class PhotosService
{
    private readonly string _connectionString;

    public PhotosService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("db")!;
    }

    public async Task<IEnumerable<Photo>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                photo_id AS Id,
                url AS Url,
                title AS Title,
                location AS Location,
                description AS Description,
                shooting_year AS ShootingYear
            FROM photos
            """;
        return await connection.QueryAsync<Photo>(query);
    }

    public async Task<Photo?> GetByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                photo_id AS Id,
                url AS Url,
                title AS Title,
                location AS Location,
                description AS Description,
                shooting_year AS ShootingYear
            FROM photos
            WHERE photo_id = @id
            """;
        return await connection.QueryFirstOrDefaultAsync<Photo>(query, new { id });
    }

    public async Task InsertAsync(Photo photo)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO photos (
                url,
                title,
                location,
                description,
                shooting_year
            ) VALUES (
                @Url,
                @Title,
                @Location,
                @Description,
                @ShootingYear
            ) RETURNING photo_id;
            """;
        photo.Id = await connection.ExecuteScalarAsync<int>(query, photo);
    }

    public async Task<bool> UpdateAsync(Photo photo)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE photos SET
                url = @Url,
                title = @Title,
                location = @Location,
                description = @Description,
                shooting_year = @ShootingYear
            WHERE photo_id = @Id;
            """;
        int result = await connection.ExecuteAsync(query, photo);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            DELETE FROM photos
            WHERE photo_id = @id;
            """;
        int result = await connection.ExecuteAsync(query, new { id });
        return result > 0;
    }
}
