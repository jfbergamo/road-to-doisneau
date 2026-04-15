using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface IOrdersService
    {
        Task<bool> DeleteAsync(int id);
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetListAsync();
        Task InsertAsync(Order order);
        Task<bool> UpdateAsync(Order order);
    }
}