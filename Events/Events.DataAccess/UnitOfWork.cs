using Events.Core.Abstractions;
using Events.DataAccess.Repositories;

namespace Events.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Categories = new CategoryRepository(context);
        }

        public ICategorysRepository Categories { get; }

        ICategorysRepository IUnitOfWork.Categories => throw new NotImplementedException();

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
