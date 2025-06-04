using ErrorOr;
using MediatR;
using Contracts.Pokemons;
using Contracts.Teams;
using Domain.Interfaces;

namespace Application.Teams.Commands.CreateTeam;

public record CreateTeamCommand(TeamRequest Team) : IRequest<ErrorOr<Success>>;