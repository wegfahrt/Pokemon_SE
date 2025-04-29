using ErrorOr;
using MediatR;
using Contracts.Pokemons;
using Contracts.Teams;

namespace Application.Teams.Queries.GetAllTeamsOfUser;

public record GetAllTeamsOfUserQuery(int id) : IRequest<ErrorOr<List<TeamResponse>>>;