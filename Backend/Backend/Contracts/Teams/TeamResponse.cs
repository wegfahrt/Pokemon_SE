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
    int HpIv,
    int AttackIv,
    int DefenseIv,
    int SpecialAttackIv,
    int SpecialDefenseIv,
    int SpeedIv,
    int HpEv,
    int AttackEv,
    int DefenseEv,
    int SpecialAttackEv,
    int SpecialDefenseEv,
    int SpeedEv,
    List<MoveResponse> Moves
);

public record MoveResponse(
    int Id,
    int MoveId
);



