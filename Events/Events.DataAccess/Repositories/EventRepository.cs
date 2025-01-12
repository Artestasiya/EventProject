using Events.Core.Abstractions;
using Events.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Events.DataAccess.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Event> GetEventAsync(int eventId)
        {
            return await _context.Set<Event>().FirstOrDefaultAsync(e => e.id_event == eventId);
        }

        public Event GetEvent(int eventId)
        {
            return _context.Set<Event>().FirstOrDefault(e => e.id_event == eventId);
        }

        public async Task<Event> SaveEventAsync(Event eventEntity)
        {
            await _context.Set<Event>().AddAsync(eventEntity);
            await _context.SaveChangesAsync();
            return eventEntity;
        }

        public Event SaveEvent(Event eventEntity)
        {
            _context.Set<Event>().Add(eventEntity);
            _context.SaveChanges();
            return eventEntity;
        }

        public async Task<List<Event>> GetAllEvents()
        {
            return await _context.Set<Event>().ToListAsync();
        }

        Task IEventRepository.GetAllEvents(int eventId)
        {
            throw new NotImplementedException();
        }
    }
}