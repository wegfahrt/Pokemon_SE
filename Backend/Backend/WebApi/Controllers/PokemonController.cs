using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Pokemons.Queries.GetAllPokemons;
using Application.Pokemons.Queries.GetPokemonDetails;
using Contracts.Pokemons;

namespace WebApi.Controllers;

[Route("PokemonApi/[controller]")]
public class PokemonController(ISender _mediator) : ApiController
{

    /// <summary>
    /// Gets a specified amount/page of pokemon
    /// </summary>
    /// <param name="limit">The amount of pokemon per page (default: 20)</param>
    /// <param name="page">The page offset (default: 0)</param>
    /// <returns>A list of basic pokemon</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllPokemons(
        [FromQuery] int limit = 20, 
        [FromQuery] int page = 0)
    {
        var query = new GetAllPokemonsQuery(limit, page);

        var result = await _mediator.Send(query);

        return result.Match(
            pokemons => Ok(pokemons),
            Problem);
    }
    
    /// <summary>
    /// Gets a specified pokemon
    /// </summary>
    /// <param name="name">The name of the pokemon</param>
    /// <returns>A detailed pokemon</returns>
    [HttpGet("{name}")]
    public async Task<IActionResult> GetPokemonDetails(
            string name)
    {
        var query = new GetPokemonDetailsQuery(name);

        var result = await _mediator.Send(query);

        return result.Match(
    pokemon => Ok(pokemon),
            Problem);
    }

    // private PokemonResponse ToDto(Reminder reminder) =>
    //     new(pokemon.Id, pokemon.Name);
}