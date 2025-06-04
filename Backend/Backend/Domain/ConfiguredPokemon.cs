using ErrorOr;
using Domain.Interfaces;

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
    
    // IV Properties
    public int HpIv { get; private set; }
    public int AttackIv { get; private set; }
    public int DefenseIv { get; private set; }
    public int SpecialAttackIv { get; private set; }
    public int SpecialDefenseIv { get; private set; }
    public int SpeedIv { get; private set; }
    
    // EV Properties
    public int HpEv { get; private set; }
    public int AttackEv { get; private set; }
    public int DefenseEv { get; private set; }
    public int SpecialAttackEv { get; private set; }
    public int SpecialDefenseEv { get; private set; }
    public int SpeedEv { get; private set; }
    
    private readonly List<ConfiguredMove> _moves = new();
    public IReadOnlyCollection<ConfiguredMove> Moves => _moves.AsReadOnly();
    
    // Private constructor for factory method
    private ConfiguredPokemon() { }
    
    // Domain behavior for adding moves with validation
    public ErrorOr<Success> AddMove(ConfiguredMove move)
    {
        if (_moves.Count >= 4)
            return Error.Conflict(description: "A Pokémon cannot have more than 4 moves");
            
        if (_moves.Any(m => m.MoveId == move.MoveId))
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
    
    // Factory method for creating from PokemonRequest
    public static ErrorOr<ConfiguredPokemon> CreateFromRequest(PokemonRequest request)
    {
        // Validate basic properties
        if (string.IsNullOrWhiteSpace(request.Name))
            return Error.Validation(description: "Pokemon name cannot be empty");
            
        // Validate stats are positive
        if (request.HP <= 0 || request.Attack < 0 || request.Defense < 0 || 
            request.SpecialAttack < 0 || request.SpecialDefense < 0 || request.Speed < 0)
            return Error.Validation(description: "Pokemon stats must be non-negative (HP must be positive)");
            
        // Validate IVs (0-31)
        var ivs = new[] { 
            request.HpIv, request.AttackIv, request.DefenseIv, 
            request.SpecialAttackIv, request.SpecialDefenseIv, request.SpeedIv 
        };
        if (ivs.Any(iv => iv < 0 || iv > 31))
            return Error.Validation(description: "IVs must be between 0 and 31");
            
        // Validate EVs (0-255, total <= 510)
        var evs = new[] { 
            request.HpEv, request.AttackEv, request.DefenseEv, 
            request.SpecialAttackEv, request.SpecialDefenseEv, request.SpeedEv 
        };
        if (evs.Any(ev => ev < 0 || ev > 255))
            return Error.Validation(description: "EVs must be between 0 and 255");
            
        if (evs.Sum() > 510)
            return Error.Validation(description: "Total EVs cannot exceed 510");

        if (request.AbilityId <= 0)
            return Error.Validation(description: "AbilityId must be valid");

        var pokemon = new ConfiguredPokemon
        {
            Name = request.Name,
            HP = request.HP,
            Attack = request.Attack,
            Defense = request.Defense,
            SpecialAttack = request.SpecialAttack,
            SpecialDefense = request.SpecialDefense,
            Speed = request.Speed,
            AbilityId = request.AbilityId,
            HpIv = request.HpIv,
            AttackIv = request.AttackIv,
            DefenseIv = request.DefenseIv,
            SpecialAttackIv = request.SpecialAttackIv,
            SpecialDefenseIv = request.SpecialDefenseIv,
            SpeedIv = request.SpeedIv,
            HpEv = request.HpEv,
            AttackEv = request.AttackEv,
            DefenseEv = request.DefenseEv,
            SpecialAttackEv = request.SpecialAttackEv,
            SpecialDefenseEv = request.SpecialDefenseEv,
            SpeedEv = request.SpeedEv
        };
        
        foreach (var moveRequest in request.Moves)
        {
            var moveResult = ConfiguredMove.CreateFromRequest(moveRequest);
            if (moveResult.IsError)
                return moveResult.Errors;
                
            var addResult = pokemon.AddMove(moveResult.Value);
            if (addResult.IsError)
                return addResult.Errors;
        }
        
        return pokemon;
    }
}