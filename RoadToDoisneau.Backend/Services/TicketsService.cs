using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class TicketsService : ITicketsService
{
    private readonly string _connectionString;

    public TicketsService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
    }

    public async Task<IEnumerable<Ticket>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                ticket_id         AS Id,
                holder_name       AS HolderName,
                holder_email      AS HolderEmail,
                created_at        AS CreatedAt,
                expires_at        AS ExpiresAt,
                has_booklet       AS HasBooklet,
                fk_price_id       AS PriceId,
                fk_order_id       AS OrderId
            FROM tickets
            """;
        return await connection.QueryAsync<Ticket>(query);
    }

    public async Task<IEnumerable<Ticket>> GetByOrderAsync(int orderId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                ticket_id         AS Id,
                holder_name       AS HolderName,
                holder_email      AS HolderEmail,
                created_at        AS CreatedAt,
                expires_at        AS ExpiresAt,
                has_booklet       AS HasBooklet,
                fk_price_id       AS PriceId,
                fk_order_id       AS OrderId
            FROM
                tickets
            WHERE
                fk_order_id = @orderId
            """;
        return await connection.QueryAsync<Ticket>(query, new { orderId });
    }

    public async Task<Ticket?> GetByIdAsync(Guid id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                ticket_id         AS Id,
                holder_name       AS HolderName,
                holder_email      AS HolderEmail,
                created_at        AS CreatedAt,
                expires_at        AS ExpiresAt,
                has_booklet       AS HasBooklet,
                fk_price_id       AS PriceId,
                fk_order_id       AS OrderId
            FROM tickets
            WHERE ticket_id = @id
            """;
        var ticket = await connection.QuerySingleOrDefaultAsync<Ticket>(query, new { id });

        return ticket;
    }

    public async Task InsertAsync(Ticket ticket)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO tickets (
                holder_name,
                holder_email,
                created_at,
                expires_at,
                has_booklet,
                fk_price_id,
                fk_order_id
            ) VALUES (
                @HolderName,
                @HolderEmail,
                @CreatedAt,
                @ExpiresAt,
                @HasBooklet,
                @PriceId,
                @OrderId
            ) RETURNING ticket_id
            """;
        ticket.Id = await connection.ExecuteScalarAsync<Guid>(query, ticket);
    }

    public async Task<bool> UpdateAsync(Ticket ticket)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE tickets SET
                holder_name  = @HolderName,
                holder_email = @HolderEmail,
                created_at   = @CreatedAt,
                expires_at   = @ExpiresAt,
                has_booklet  = @HasBooklet,
                fk_price_id  = @PriceId,
                fk_order_id  = @OrderId
            WHERE ticket_id  = @Id;
            """;
        int result = await connection.ExecuteAsync(query, ticket);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            DELETE FROM tickets
            WHERE ticket_id = @id;
            """;
        int result = await connection.ExecuteAsync(query, new { id });
        return result > 0;
    }
}
