namespace Events.Application.DTOs
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int MaxAmount { get; set; }
        public string Image { get; set; }
    }
}
