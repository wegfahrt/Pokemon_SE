namespace Domain;

// public class Move
// {
//     public int Id { get; private set; }
//     public string? Name { get; private set; }
//     public PokemonType? Type { get; private set; }
//     public int? Power { get; private set; }
//     public int? Accuracy { get; private set; }
//     public MoveCategory? Category { get; private set; }
//         
//     // Domain behavior and validation
// }
//     
// public enum MoveCategory
// {
//     Physical, Special, Status
// }

public class ConfiguredMove
{
    public int Id { get; private set; }
    public int ConfiguredPokemonId { get; private set; }
    public int MoveId { get; private set; }
}