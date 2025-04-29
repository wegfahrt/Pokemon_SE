using Domain;

namespace Contracts.Teams;

public record TeamResponse (
    int Id,
    string Name,
    int User,
    List<PokemonResponse> Pokemon
);

public record PokemonResponse(
    int Id,
    string Name,
    int HP,
    int Attack,
    int Defense,
    int SpecialAttack,
    int SpecialDefense,
    int Speed,
    int AbilityId,
    List<MoveResponse> Moves
);

public record MoveResponse(
    int Id,
    int MoveId
);



