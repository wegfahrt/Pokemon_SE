using Domain;

namespace Contracts.Teams;

public record TeamResponse (
    int Id,
    string Name,
    int User,
    List<ConfiguredPokemon> Pokemon
);


