using ErrorOr;
using MediatR;
using PokeApiNet;
using Application.Common;

namespace Application.Pokemons.Queries;



public class GetAllPokemonsQueryHandler(int Limit = 100) : IRequestHandler<GetAllPokemonsQuery, ErrorOr<NamedApiResourceList<Pokemon>>>
{
    public async Task<ErrorOr<NamedApiResourceList<Pokemon>>> Handle(GetAllPokemonsQuery request, CancellationToken cancellationToken)
    {

        var pokeClient = new CustomPokeApiClient();

        NamedApiResourceList<Pokemon> pokemons = await pokeClient.GetNamedResourcePageAsync<Pokemon>();
        
        return pokemons;

    }
}