using Application.Common.Interfaces;
using Contracts.Teams;
using ErrorOr;
using MediatR;

using Microsoft.EntityFrameworkCore;

namespace Application.Teams.Commands.CreateTeam;


public class GetAllPokemonsQueryHandler(IAppDbContext _context) : IRequestHandler<CreateTeamCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(CreateTeamCommand request,
        CancellationToken cancellationToken)
    {
        return Result.Success;
    }
}