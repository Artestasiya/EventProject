using Events.Core.Models;

namespace Events.Core.Abstractions
{
    public interface IEventRepository
    {
        Task<Event> GetEventAsync(int eventId);
        Task<Event> SaveEventAsync(Event eventEntity);
        Task GetAllEvents(int eventId);
        Task<List<Event>> GetAllEvents();
        Event SaveEvent(Event eventEntity);
        Event GetEvent(int eventId);
    }
}