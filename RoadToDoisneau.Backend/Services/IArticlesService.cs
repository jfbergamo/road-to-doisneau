using RoadToDoisneau.Backend.Models;

namespace RoadToDoisneau.Backend.Services
{
    public interface IArticlesService
    {
        Task<bool> DeleteAsync(int id);
        Task<Article?> GetByIdAsync(int id);
        Task<IEnumerable<Article>> GetListAsync();
        Task InsertAsync(Article article);
        Task<bool> UpdateAsync(Article article);
    }
}