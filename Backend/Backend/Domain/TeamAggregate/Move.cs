using ErrorOr;
using Domain.Interfaces;

public class ConfiguredMove
{
    public int Id { get; private set; }
    public int ConfiguredPokemonId { get; private set; }
    public int MoveId { get; private set; }
    
    // Private constructor for factory method
    private ConfiguredMove() { }
    
    // Factory method for creating from MoveRequest
    public static ErrorOr<ConfiguredMove> CreateFromRequest(MoveRequest request)
    {
        if (request.MoveId <= 0)
            return Error.Validation(description: "MoveId must be valid");
            
        return new ConfiguredMove
        {
            MoveId = request.MoveId
        };
    }
}