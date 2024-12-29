using Microsoft.AspNetCore.Mvc;
using Events.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Events.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class EventRegistrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventRegistrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("{eventId}/register")]
        public async Task < IActionResult > RegisterForEvent(int eventId, [FromBody] Member member)
        {
            // Шаг 1: Проверяем, существует ли событие с таким ID
            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.id_event == eventId);

            if (eventItem == null) {
                return NotFound("Event not found.");
            }

            // Шаг 2: Проверяем, не превышен ли лимит участников
            var currentRegistrations = await _context.Member_events
                .Where(me => me.id_event == eventId)
                .CountAsync();

            if (currentRegistrations >= eventItem.max_amount) {
                return BadRequest("Event has reached the maximum number of participants.");
            }

            // Шаг 3: Проверяем, зарегистрирован ли уже пользователь на это событие
            var existingRegistration = await _context.Member_events
                .FirstOrDefaultAsync(me => me.id_event == eventId && me.id_member == member.id_member);

            if (existingRegistration != null) {
                return BadRequest("User is already registered for this event.");
            }

            // Шаг 4: Добавляем нового участника в таблицу Member_event
            var newRegistration = new Member_event
            {
                id_event = eventId,
                    id_member = member.id_member,
                    reg_date = DateTime.Now
            };

            _context.Member_events.Add(newRegistration);
            await _context.SaveChangesAsync();

            return Ok("Registration successful.");
        }
    }
}
