using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAppDbContext
{
    public DbSet<ConfiguredPokemon> ConfiguredPokemons { get; set; }

    public DbSet<ConfiguredMove> ConfiguredPokemonMoves { get; set; }

    public DbSet<Team> TeamPresets { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    
}