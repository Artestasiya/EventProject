using Events.Core.Models;
using System.Linq;

namespace Events.DataAccess.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Event GetEvent(int eventId)
        {
            return _context.Set<Event>().FirstOrDefault(e => e.id_event == eventId);
        }

        public async Task GetEvent()
        {
            throw new NotImplementedException();
        }

        public Event SaveEvent(Event eventEntity)
        {
            _context.Set<Event>().Add(eventEntity);
            _context.SaveChanges();
            return eventEntity;
        }

        Task IEventRepository.GetAllEvents(int eventId)
        {
            throw new NotImplementedException();
        }

        IQueryable<Event> IEventRepository.GetAllEvents()
        {
            throw new NotImplementedException();
        }

        Event IEventRepository.GetEvent(int eventId)
        {
            throw new NotImplementedException();
        }

        Task<Event> IEventRepository.GetEventAsync(int eventId)
        {
            throw new NotImplementedException();
        }

        Event IEventRepository.SaveEvent(Event eventEntity)
        {
            throw new NotImplementedException();
        }

        Task<Event> IEventRepository.SaveEventAsync(Event eventEntity)
        {
            throw new NotImplementedException();
        }
    }
}
