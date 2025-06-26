
namespace Infrastructure.Models;

public class ConfiguredPokemon
{
    public int ConfiguredPokemonId { get; set; }

    public string Name { get; set; } = null!;

    public int Hp { get; set; }

    public int Attack { get; set; }

    public int Defence { get; set; }

    public int SpecialAttack { get; set; }

    public int SpecialDefence { get; set; }

    public int Speed { get; set; }

    public int Ability { get; set; }

    public virtual ICollection<ConfiguredPokemonMove> ConfiguredPokemonMoves { get; set; } = new List<ConfiguredPokemonMove>();

    public virtual ICollection<PresetPokemonRef> PresetPokemonRefs { get; set; } = new List<PresetPokemonRef>();
}


