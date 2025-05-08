using ErrorOr;
using MediatR;
using PokeApiNet;
using Application.Common;
using Contracts.Pokemons;

namespace Application.Pokemons.Queries.GetAllPokemons;



public class GetAllPokemonsQueryHandler() : IRequestHandler<GetAllPokemonsQuery, ErrorOr<List<PokemonBasicResponse>>>
{
    public async Task<ErrorOr<List<PokemonBasicResponse>>> Handle(GetAllPokemonsQuery request, CancellationToken cancellationToken)
    {

        var pokeClient = new CustomPokeApiClient();
        
        NamedApiResourceList<Pokemon> pokemons = await pokeClient.GetNamedResourcePageAsync<Pokemon>(limit: request.Limit, offset: request.Page * request.Limit, cancellationToken);

        var pokemonTasks = pokemons.Results.Select(async pokemonResource =>
        {
            var pokemon = await pokeClient.GetResourceAsync<Pokemon>(pokemonResource.Name);
            var response = new PokemonBasicResponse(
                Id: pokemon.Id,
                Name: pokemon.Name,
                Types: pokemon.Types.Select(t => t.Type.Name).ToList(),
                SpriteUrl: pokemon.Sprites.Other.OfficialArtwork.FrontDefault
            );
            return response;
        }); 

        
        var pokemonResponses = await Task.WhenAll(pokemonTasks);
        var resultList = pokemonResponses.ToList();
        
        return resultList;
    }
}