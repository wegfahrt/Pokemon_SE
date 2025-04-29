
namespace Infrastructure.Models;

public class TeamPreset
{
    public int TeamPresetId { get; set; }

    public int UserId { get; set; }

    public int PresetId { get; set; }

    public string? PresetName { get; set; }

    public virtual ICollection<PresetPokemonRef> PresetPokemonRefs { get; set; } = new List<PresetPokemonRef>();
}
