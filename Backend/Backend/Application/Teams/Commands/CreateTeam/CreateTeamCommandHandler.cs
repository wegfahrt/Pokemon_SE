using Application.Common.Interfaces;
using ErrorOr;
using MediatR;
using Domain;
using Domain.Interfaces;

namespace Application.Teams.Commands.CreateTeam;

public class CreateTeamCommandHandler(IAppDbContext _context) : IRequestHandler<CreateTeamCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {

        var teamRequest = new TeamRequest(
            Name: request.Team.Name,
            User: request.Team.User, 
            Pokemon: request.Team.Pokemon // assuming your command has this structure
        );
        
        // Create the team using the factory method
        var teamResult = Team.CreateFromRequest(teamRequest);
        
        if (teamResult.IsError)
            return teamResult.Errors;
            
        var team = teamResult.Value;
        
        // Add to context and save
        _context.TeamPresets.Add(team);
        await _context.SaveChangesAsync(cancellationToken);
        
        return Result.Success;
    }
}