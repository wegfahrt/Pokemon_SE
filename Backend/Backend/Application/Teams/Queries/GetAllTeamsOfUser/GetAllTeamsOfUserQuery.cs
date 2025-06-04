using ErrorOr;
using MediatR;
using Contracts.Pokemons;
using Contracts.Teams;
using Domain.Interfaces;

namespace Application.Teams.Queries.GetAllTeamsOfUser;

public record GetAllTeamsOfUserQuery(int id) : IRequest<ErrorOr<List<TeamResponse>>>;