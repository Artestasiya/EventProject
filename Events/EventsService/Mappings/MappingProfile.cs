using AutoMapper;
using Events.Core.Models;
using Events.DataAccess.Entites;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Events.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            
            CreateMap<CategoryEntity, Category>().ReverseMap();
        }
    }
}
