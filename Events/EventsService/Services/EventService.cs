using Events.Application.DTOs;
using Events.Core.Abstractions;
using System.Linq;

namespace Events.Application.Services
{
    public class EventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<PaginatedResult<EventDto>> GetEventsWithPagination(int page, int pageSize)
        {
            var events = await _eventRepository.GetAllEvents(); // Fetch all events

            var totalItems = events.Count;
            var eventDtos = events.Skip((page - 1) * pageSize)
                                  .Take(pageSize)
                                  .Select(e => new EventDto
                                  {
                                      Id = e.id_event,
                                      Name = e.name,
                                      Description = e.description,
                                      Date = e.date,
                                      MaxAmount = e.max_amount,
                                      Image = e.image
                                  })
                                  .ToList();

            return new PaginatedResult<EventDto>
            {
                Items = eventDtos,
                TotalCount = totalItems,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}