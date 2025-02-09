using Contracts.Pokemons;
using ErrorOr;
using MediatR;

namespace Application.Pokemons.Queries.GetPokemonDetails;

public record GetPokemonDetailsQuery(string Name) : IRequest<ErrorOr<PokemonDetailedResponse>>;