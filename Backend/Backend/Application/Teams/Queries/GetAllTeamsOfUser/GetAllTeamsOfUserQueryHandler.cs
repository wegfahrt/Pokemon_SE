using ErrorOr;
using MediatR;
using Application.Common.Interfaces;
using Application.Extensions;
using Contracts.Teams;
using Microsoft.EntityFrameworkCore;

namespace Application.Teams.Queries.GetAllTeamsOfUser;

public class GetAllPokemonsQueryHandler(IAppDbContext _context) : IRequestHandler<GetAllTeamsOfUserQuery, ErrorOr<List<TeamResponse>>>
{
    public async Task<ErrorOr<List<TeamResponse>>> Handle(GetAllTeamsOfUserQuery request,
        CancellationToken cancellationToken)
    {
         var response =  _context.TeamPresets
            .Where(t=> t.TrainerId == request.id)
            .Include(t => t.Pokemon)
            .ThenInclude(pm => pm.Moves)
            .ToList();

        if (response.Count < 1)
        {
            return Error.Conflict(description: "No Teams found");
        }
        
        return response.Select(t => t.ToDTO()).ToList();
    }
}