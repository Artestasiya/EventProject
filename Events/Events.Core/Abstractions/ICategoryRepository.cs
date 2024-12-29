using Events.Core.Models;

namespace Events.Core.Abstractions
{
    public interface ICategorysRepository
    {
        Task<int> Create(Category category);
        Task<int> Delete(int id_category);
        Task<List<Category>> Get();
        Task<int> Update(int id_category, string name, string description);
    }
}