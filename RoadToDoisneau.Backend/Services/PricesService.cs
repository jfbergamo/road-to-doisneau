using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class PricesService : IPricesService
{
    private readonly string _connectionString;

    public PricesService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
    }

    public async Task<IEnumerable<Price>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                price_id AS Id,
                category AS Category,
                price    AS PriceValue
            FROM prices
            """;
        return await connection.QueryAsync<Price>(query);
    }

    public async Task<Price?> GetByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                price_id AS Id,
                category AS Category,
                price    AS PriceValue
            FROM prices
            WHERE price_id = @id
            """;
        return await connection.QueryFirstOrDefaultAsync<Price>(query, new { id });
    }

    public async Task<decimal> GetPriceByIdAsync(int id)
    {
        return (await GetByIdAsync(id))?.PriceValue ?? 0;
    }

    public async Task InsertAsync(Price price)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO prices (
                category,
                price
            ) VALUES (
                @Category, 
                @PriceValue
            ) RETURNING price_id
            """;
        price.Id = await connection.ExecuteScalarAsync<int>(query, price);
    }

    public async Task<bool> UpdateAsync(Price price)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE prices
            SET
                category = @Category,
                price    = @PriceValue
            WHERE
                price_id = @Id
            """;
        int result = await connection.ExecuteAsync(query, price);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            DELETE FROM prices
            WHERE price_id = @id
            """;
        int result = await connection.ExecuteAsync(query, new { id });
        return result > 0;
    }
}
