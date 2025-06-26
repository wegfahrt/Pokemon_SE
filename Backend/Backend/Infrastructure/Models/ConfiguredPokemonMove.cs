
namespace Infrastructure.Models;

public class ConfiguredPokemonMove
{
    public int PokemonMoveId { get; set; }
    public int ConfiguredPokemonId { get; set; }

    public int Move { get; set; }

    public virtual ConfiguredPokemon ConfiguredPokemon { get; set; } = null!;
}
