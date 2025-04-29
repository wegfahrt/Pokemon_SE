using ErrorOr;

namespace Domain;

public class Trainer
{
    public int Id { get; private set; }
    // public string Name { get; private set; }
        
    private readonly List<Team> _teams = new();
    public IReadOnlyCollection<Team> Teams => _teams.AsReadOnly();

    public ErrorOr<Success> AddTeam(Team team)
    {
        // Add validation
        
        _teams.Add(team);
        return Result.Success;
    }
    
}