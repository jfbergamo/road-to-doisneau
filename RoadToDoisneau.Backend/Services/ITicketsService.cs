using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface ITicketsService
    {
        Task<bool> DeleteAsync(int id);
        Task<Ticket?> GetByIdAsync(int id);
        Task<IEnumerable<Ticket>> GetListAsync();
        Task InsertAsync(Ticket ticket);
        Task<bool> UpdateAsync(Photo photo);
    }
}