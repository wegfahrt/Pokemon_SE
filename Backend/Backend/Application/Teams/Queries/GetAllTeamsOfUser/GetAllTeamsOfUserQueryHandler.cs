using Contracts.Teams;
using ErrorOr;
using MediatR;

namespace Application.Teams.Queries.GetAllTeamsOfUser;

public class GetAllPokemonsQueryHandler() : IRequestHandler<GetAllTeamsOfUserQuery, ErrorOr<List<TeamResponse>>>
{
    public async Task<ErrorOr<List<TeamResponse>>> Handle(GetAllTeamsOfUserQuery request,
        CancellationToken cancellationToken)
    {
        return new ErrorOr<List<TeamResponse>>();
    }
}