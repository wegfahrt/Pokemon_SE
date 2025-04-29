using Application.Teams.Queries.GetAllTeamsOfUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

using Contracts.Pokemons;

namespace WebApi.Controllers;

[Route("PokemonApi/[controller]")]
public class TeamController(ISender _mediator) : ApiController
{
    /// <summary>
    /// Gets all teams of an user
    /// </summary>
    /// <param userId="userId">The Id of the user</param>
    /// <returns>All saved teams of the user/returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPokemonDetails(
        int id)
    {
        var query = new GetAllTeamsOfUserQuery(id);

        var result = await _mediator.Send(query);

        return result.Match(
            teams => Ok(teams),
            Problem);
    }

}