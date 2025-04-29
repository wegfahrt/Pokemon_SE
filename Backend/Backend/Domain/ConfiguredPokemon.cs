using ErrorOr;

namespace Domain;

public class ConfiguredPokemon
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public int HP { get; private set; }
    public int Attack { get; private set; }
    public int Defense { get; private set; }
    public int SpecialAttack { get; private set; }
    public int SpecialDefense { get; private set; }
    public int Speed { get; private set; }
    public int AbilityId { get; private set; }
    
    public int TeamId { get; private set; }
    
    public PokemonType? PrimaryType { get; private set; }
    public PokemonType? SecondaryType { get; private set; }
        
    private readonly List<ConfiguredMove> _moves = new();
    public IReadOnlyCollection<ConfiguredMove> Moves => _moves.AsReadOnly();
        
    // Domain behavior for adding moves with validation
    public ErrorOr<Success> AddMove(ConfiguredMove move)
    {
        if (_moves.Count >= 4)
            return Error.Conflict(description: "A Pokémon cannot have more than 4 moves");
                
        if (_moves.Any(m => m.Id == move.Id))
            return Error.Conflict(description: "This move is already added to this Pokémon");
                
        _moves.Add(move);
        return Result.Success;
    }

    public ErrorOr<Success> RemoveMove(ConfiguredMove move)
    {
        if (_moves.All(m => m.Id != move.Id))
        {
            return Error.Conflict(description: "Move not found");
        }
        
        _moves.Remove(move);
        return Result.Success;
    }
    

        
    // Other domain methods like CalculateDamage, etc.
    

}
    
public enum PokemonType
{
    Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy
    
}

