using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Pokemons.Queries;

namespace WebApi.Controllers;

[Route("Pokemon/[controller]")]
public class PokemonController(ISender _mediator) : ApiController
{

    /// <summary>
    /// Gets a specific weather forecast
    /// </summary>
    /// <param name="id">The forecast ID</param>
    /// <returns>A weather forecast</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllPokemon()
    {
        var query = new GetAllPokemonsQuery();

        var result = await _mediator.Send(query);

        return result.Match(
            pokemons => Ok(pokemons),
            Problem);
    }

    // private PokemonResponse ToDto(Reminder reminder) =>
    //     new(pokemon.Id, pokemon.Name);
}