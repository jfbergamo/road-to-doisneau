using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface IPhotosService
    {
        Task<bool> DeleteAsync(int id);
        Task<Photo?> GetByIdAsync(int id);
        Task<IEnumerable<Photo>> GetListAsync();
        Task InsertAsync(Photo photo);
        Task<bool> UpdateAsync(Photo photo);
    }
}