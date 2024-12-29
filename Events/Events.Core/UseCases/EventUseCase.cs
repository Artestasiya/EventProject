using Events.Core.Models;
using Events.DataAccess.Repositories;

namespace Events.Core.UseCases
{
    public class EventUseCase
    {
        private readonly IEventRepository _eventRepository;

        public EventUseCase(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public Event CreateEvent(string name, string description, DateTime date, int idPlace, int idCategory, int maxAmount, string image)
        {
            var newEvent = new Event
            {
                name = name,
                description = description,
                date = date,
                id_place = idPlace,
                id_category = idCategory,
                max_amount = maxAmount,
                image = image
            };

            return _eventRepository.SaveEvent(newEvent);
        }

        public Event GetEventById(int eventId)
        {
            return _eventRepository.GetEvent(eventId);
        }
    }
}
