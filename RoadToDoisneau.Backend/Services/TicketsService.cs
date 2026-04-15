using Dapper;
using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services;

public class TicketsService
{
    private readonly string _connectionString;
    private readonly PricesService _ps;
    private readonly OrdersService _os;

    public TicketsService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("db")!;
        _ps = new PricesService(config);
        _os = new OrdersService(config);
    }

    public async Task<IEnumerable<Ticket>> GetListAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                ticket_id         AS Id,
                holder_first_name AS HolderFirstName,
                holder_last_name  AS HolderLastName,
                holder_mail       AS HolderEmail,
                created_at        AS CreatedAt,
                expires_at        AS ExpiresAt,
                has_booklet       AS HasBooklet,
                fk_price_id       AS PriceId,
                fk_order_id       AS OrderId
            FROM tickets
            """;
        return await connection.QueryAsync<Ticket>(query);
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            SELECT
                ticket_id         AS Id,
                holder_first_name AS HolderFirstName,
                holder_last_name  AS HolderLastName,
                holder_mail       AS HolderEmail,
                created_at        AS CreatedAt,
                expires_at        AS ExpiresAt,
                has_booklet       AS HasBooklet,
                fk_price_id       AS PriceId,
                fk_order_id       AS OrderId
            FROM tickets
            WHERE ticket_id = @id
            """;
        var ticket = await connection.QuerySingleOrDefaultAsync<Ticket>(query, new { id });

        if (ticket is not null)
        {
            ticket.Price = await _ps.GetPriceByIdAsync(ticket.PriceId);
            ticket.Order = await _os.GetByIdAsync(ticket.OrderId);
        }

        return ticket;
    }

    public async Task InsertAsync(Ticket ticket)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            INSERT INTO tickets (
                holder_first_name,
                holder_last_name,
                holder_mail,
                created_at,
                expires_at,
                has_booklet,
                fk_price_id,
                fk_order_id
            ) VALUES (
                @HolderFirstName,
                @HolderLastName,
                @HolderEmail,
                @CreatedAt,
                @ExpiresAt,
                @HasBooklet,
                @PriceId,
                @OrderId
            ) RETURNING ticket_id
            """;
        ticket.Id = await connection.ExecuteScalarAsync<int>(query, ticket);
    }

    public async Task<bool> UpdateAsync(Photo photo)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        string query = """
            UPDATE tickets SET
                holder_first_name = @HolderFirstName,
                holder_last_name = @HolderLastName,
                holder_mail = @HolderEmail,
                created_at = @CreatedAt,
                expires_at = @ExpiresAt,
                has_booklet = @HasBooklet,
                fk_price_id = @PriceId,
                fk_order_id = @OrderId
            WHERE ticket_id = @Id;
            """;
        int result = await connection.ExecuteAsync(query, photo);
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
