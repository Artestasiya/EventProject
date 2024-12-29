using Events.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Events.Core.Models;
using Events.DataAccess.Configurations;

namespace Events.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }
        public DbSet<Member_event> Member_event { get; set; }
        public DbSet<CategoryEntity> Category { get; set; }
        public DbSet<Member> Member { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Place> Place { get; set; }
        public DbSet<Loggin> Loggin { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        }

    }
}
