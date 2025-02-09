using System.Data.Common;
using PokeApiNet;


namespace Contracts.Pokemons;

public record PokemonBasicResponse (
    int Id,
    string Name,
    List<string> Types,
    string SpriteUrl
    );
