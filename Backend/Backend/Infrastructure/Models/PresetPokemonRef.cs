
namespace Infrastructure.Models;

public class PresetPokemonRef
{
    public int PresetPokemonRefId { get; set; }

    public int TeamPresetId { get; set; }

    public int ConfiguredPokemonId { get; set; }

    public virtual ConfiguredPokemon ConfiguredPokemon { get; set; } = null!;

    public virtual TeamPreset TeamPreset { get; set; } = null!;
}
