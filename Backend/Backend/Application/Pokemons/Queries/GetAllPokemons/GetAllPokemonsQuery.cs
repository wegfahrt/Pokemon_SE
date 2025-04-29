using ErrorOr;
using MediatR;
using Contracts.Pokemons;

namespace Application.Pokemons.Queries.GetAllPokemons;

public record GetAllPokemonsQuery(int Limit, int Page) : IRequest<ErrorOr<List<PokemonBasicResponse>>>;