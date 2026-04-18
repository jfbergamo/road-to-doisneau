using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class OrdersService : IOrdersService
{
    private readonly string _connectionString;
    private ITicketsService _ticketsService;

    public OrdersService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
        _ticketsService = new TicketsService(config);
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
        var order = await connection.QueryFirstOrDefaultAsync<Order>(query, new { id });
        if (order is not null)
        {
            order.Tickets = await _ticketsService.GetByOrderAsync(order.Id);
        }
        return order;
    }

    public async Task<bool> InsertAsync(Order order)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        string query = """
            INSERT INTO orders (
                created_at
            ) VALUES (
                default
            ) RETURNING
                order_id   AS Id,
                created_at AS CreatedAt
            """;

        using var trans = await connection.BeginTransactionAsync();
        
        try
        {
            var result = await connection.QuerySingleAsync<Order>(query, trans);
            order.Id = result.Id;
            order.CreatedAt = result.CreatedAt;
            if (order.Tickets is not null)
            {
                foreach (var ticket in order.Tickets)
                {
                    if (await _ticketsService.GetByIdAsync(ticket.Id) is null)
                    {
                        ticket.CreatedAt = order.CreatedAt;
                        ticket.ExpiresAt = order.CreatedAt.AddMonths(6);
                        ticket.OrderId   = order.Id;
                        await _ticketsService.InsertAsync(ticket ,trans);
                    }
                }
            }
            await trans.CommitAsync();
            return true;
        }
        catch
        {
            await trans.RollbackAsync();
            return false;
        }
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
