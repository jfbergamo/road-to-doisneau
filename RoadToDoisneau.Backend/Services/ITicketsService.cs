using Npgsql;
using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface ITicketsService
    {
        Task<bool> DeleteAsync(int id);
        Task<Ticket?> GetByIdAsync(Guid id);
        Task<IEnumerable<Ticket>> GetListAsync();
        Task<IEnumerable<Ticket>> GetByOrderAsync(int orderId);
        Task InsertAsync(Ticket ticket, NpgsqlTransaction? transaction = null);
        Task<bool> UpdateAsync(Ticket ticket);
    }
}