using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Events.Application.DTOs;
using Events.Core.Models;
using Events.DataAccess.Repositories;

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
            var query = _eventRepository.GetAllEvents();

            var totalItems = await query.CountAsync();
            var events = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var eventDtos = events.Select(e => new EventDto
            {
                Id = e.id_event,
                Name = e.name,
                Description = e.description,
                Date = e.date,
                MaxAmount = e.max_amount,
                Image = e.image
            });

            return new PaginatedResult<EventDto>
            {
                Items = eventDtos.ToList(),
                TotalCount = totalItems,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
