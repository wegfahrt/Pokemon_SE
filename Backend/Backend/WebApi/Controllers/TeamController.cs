using Application.Teams.Commands.CreateTeam;
using Application.Teams.Queries.GetAllTeamsOfUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

using Contracts.Pokemons;
using Contracts.Teams;

namespace WebApi.Controllers;

[Route("PokemonApi/[controller]")]
public class TeamController(ISender _mediator) : ApiController
{
    /// <summary>
    /// Gets all teams of a user
    /// </summary>
    /// <param userId="userId">The Id of the user</param>
    /// <returns>All saved teams of the user/returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeamsOfUser(
        int id)
    {
        var query = new GetAllTeamsOfUserQuery(id);

        var result = await _mediator.Send(query);

        return result.Match(
            teams => Ok(teams),
            Problem);
    }
    
    /// <summary>
    /// Creates a team
    /// </summary>
    /// <param request>The team data</param>
    /// <returns>200/returns>
    [HttpPost("{id}")]
    public async Task<IActionResult> GetPokemonDetails(
        CreateTeamRequest request )
    {
        var command = new CreateTeamCommand(request);

        var result = await _mediator.Send(command);

        return result.Match(
            teams => Ok(teams),
            Problem);
    }

}