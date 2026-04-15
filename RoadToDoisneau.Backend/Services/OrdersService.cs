using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class OrdersService
{
    private readonly string _connectionString;
    
    public OrdersService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
    }

    public async Task<IEnumerable<Order>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                order_id   AS Id,
                created_at AS CreatedAt
            FROM orders
            """;
        return await connection.QueryAsync<Order>(query);
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                order_id   AS Id,
                created_at AS CreatedAt
            FROM orders
            WHERE order_id = @id
            """;
        return await connection.QueryFirstOrDefaultAsync<Order>(query, new { id });
    }

    public async Task InsertAsync(Order order)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO orders (
                created_at
            ) VALUES (
                default
            ) RETURNING
                order_id   AS Id,
                created_at AS CreatedAt
            """;
        var newOrder = await connection.QuerySingleAsync<Order>(query);
        order.Id = newOrder.Id;
        order.CreatedAt = newOrder.CreatedAt;
    }

    public async Task<bool> UpdateAsync(Order order)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE orders
            SET created_at = @CreatedAt
            WHERE order_id = @Id
            """;
        int result = await connection.ExecuteAsync(query, order);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            DELETE FROM orders
            WHERE order_id = @id
            """;
        int result = await connection.ExecuteAsync(query, new { id });
        return result > 0;
    }
}
