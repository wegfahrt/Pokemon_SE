using System.Data.Common;
using PokeApiNet;


namespace Contracts.Pokemons;

public record PokemonDetailedResponse (
    int Id,
    string Name,
    List<string> Types,
    List<StatDetail> PokemonStats,
    List<MoveDetail> Moves,
    string SpriteUrl
);

public record MoveDetail (
    string Name,
    string Type,
    int? Power,
    int? Accuracy,
    int? PP,
    string DamageClass
);

public record StatDetail (
    string Name,
    int BaseStat
);