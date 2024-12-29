using System.Linq;
using System.Threading.Tasks;
using Events.Core.Models;

namespace Events.DataAccess.Repositories
{
    public interface IEventRepository
    {
        Task<Event> GetEventAsync(int eventId);
        IQueryable<Event> GetAllEvents();
        Task<Event> SaveEventAsync(Event eventEntity);
        Task GetAllEvents(int eventId);
        Event SaveEvent(Event eventEntity);
        Event GetEvent(int eventId);
    }
}
