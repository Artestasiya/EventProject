using AutoMapper;
using Events.Core.Abstractions;
using Events.Core.Models;
using Events.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;

namespace Events.DataAccess.Repositories
{
    public class CategoryRepository : ICategorysRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private ApplicationDbContext context;

        public CategoryRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public CategoryRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(Category category)
        {
            var entity = _mapper.Map<CategoryEntity>(category);
            await _context.Category.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity.Id_category;
        }

        public async Task<int> DeleteAsync(int id)
        {
            var entity = await _context.Category.FirstOrDefaultAsync(c => c.Id_category == id);
            if (entity == null) return 0;

            _context.Category.Remove(entity);
            await _context.SaveChangesAsync();
            return id;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            var entities = await _context.Category.AsNoTracking().ToListAsync();
            return _mapper.Map<List<Category>>(entities);
        }

        public async Task<int> UpdateAsync(Category category)
        {
            var entity = await _context.Category.FirstOrDefaultAsync(c => c.Id_category == category.Id_category);
            if (entity == null) return 0;

            _mapper.Map(category, entity);
            await _context.SaveChangesAsync();
            return entity.Id_category;
        }

        Task<int> ICategorysRepository.Create(Category category)
        {
            throw new NotImplementedException();
        }

        Task<int> ICategorysRepository.Delete(int id_category)
        {
            throw new NotImplementedException();
        }

        Task<List<Category>> ICategorysRepository.Get()
        {
            throw new NotImplementedException();
        }

        Task<int> ICategorysRepository.Update(int id_category, string name, string description)
        {
            throw new NotImplementedException();
        }
    }
}