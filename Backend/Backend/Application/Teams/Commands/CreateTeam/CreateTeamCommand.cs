using ErrorOr;
using MediatR;
using Contracts.Teams;

namespace Application.Teams.Commands.CreateTeam;

public record CreateTeamCommand(CreateTeamRequest request) : IRequest<ErrorOr<Success>>;