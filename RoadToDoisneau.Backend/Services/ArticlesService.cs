using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class ArticlesService : IArticlesService
{
    private readonly string _connectionString;

    public ArticlesService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
    }

    public async Task<IEnumerable<Article>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);

        string query = """
            SELECT
                article_id  AS Id,
                title       AS Title,
                description AS Description,
                category    AS Category,
                quote       AS Quote,
                special     AS Special,
                page        AS Page,
                thumbnail   AS Thumbnail
            FROM articles
            """;
        return await connection.QueryAsync<Article>(query);
    }

    public async Task<Article?> GetByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                article_id  AS Id,
                title       AS Title,
                description AS Description,
                category    AS Category,
                quote       AS Quote,
                special     AS Special,
                page        AS Page,
                thumbnail   AS Thumbnail
            FROM articles
            WHERE article_id = @id
            """;
        return await connection.QueryFirstOrDefaultAsync<Article>(query, new { id });
    }

    public async Task InsertAsync(Article article)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO articles (
                title,
                description,
                category,
                quote,
                special,
                page,
                thumbnail
            ) VALUES (
                @Title,
                @Description,
                @Category,
                @Quote,
                @Special,
                @Page,
                @Thumbnail
            ) RETURNING article_id
            """;
        article.Id = await connection.ExecuteScalarAsync<int>(query, article);
    }

    public async Task<bool> UpdateAsync(Article article)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE articles
            SET
                title        = @Title,
                description  = @Description,
                category     = @Category,
                quote        = @Quote,
                special      = @Special,
                page         = @Page,
                thumbnail    = @Thumbnail
            WHERE article_id = @Id
            """;
        int result = await connection.ExecuteAsync(query, article);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            DELETE FROM articles
            WHERE article_id = @id
            """;
        int result = await connection.ExecuteAsync(query, new { id });
        return result > 0;
    }
}