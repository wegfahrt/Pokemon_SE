using ErrorOr;
using MediatR;
using PokeApiNet;

namespace Application.Pokemons.Queries;

public record GetAllPokemonsQuery() : IRequest<ErrorOr<NamedApiResourceList<Pokemon>>>;