using Contracts.Teams;
using Domain;


namespace Application.Extensions;

public static class MappingExtensions
{
    public static TeamResponse ToDTO(this Team teamPreset)
    {
        return new TeamResponse(
            teamPreset.Id,
            teamPreset.Name,
            teamPreset.TrainerId,
            teamPreset.Pokemon.Select(p => p.ToDTO()).ToList() ?? new List<PokemonResponse>()
        );
    }

    public static PokemonResponse ToDTO(this ConfiguredPokemon pokemon)
    {
        return new PokemonResponse(
            pokemon.Id,
            pokemon.Name,
            pokemon.HP,
            pokemon.Attack,
            pokemon.Defense,
            pokemon.SpecialAttack,
            pokemon.SpecialDefense,
            pokemon.Speed,
            pokemon.AbilityId,
            pokemon.Moves?.Select(m => m.ToDTO()).ToList() ?? new List<MoveResponse>()
        );
    }

    public static MoveResponse ToDTO(this ConfiguredMove pokemonMove)
    {
        return new MoveResponse(
            pokemonMove.Id,
            pokemonMove.MoveId
        );
    }
}