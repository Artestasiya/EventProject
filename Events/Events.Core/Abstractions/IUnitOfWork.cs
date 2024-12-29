using System.Threading.Tasks;

namespace Events.Core.Abstractions
{
    public interface IUnitOfWork
    {
        ICategorysRepository Categories { get; }
        Task<int> SaveChangesAsync();
    }
}
