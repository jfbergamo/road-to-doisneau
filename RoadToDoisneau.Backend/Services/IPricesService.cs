using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface IPricesService
    {
        Task<bool> DeleteAsync(int id);
        Task<Price?> GetByIdAsync(int id);
        Task<IEnumerable<Price>> GetListAsync();
        Task<decimal> GetPriceByIdAsync(int id);
        Task InsertAsync(Price price);
        Task<bool> UpdateAsync(Price price);
    }
}