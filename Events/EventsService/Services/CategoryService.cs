using Events.Core.Abstractions;
using Events.Core.Models;

namespace Events.Application.Services
{
    public class CategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return await _unitOfWork.Categories.Get();
        }

        public async Task AddCategoryAsync(Category category)
        {
            await _unitOfWork.Categories.Create(category);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
