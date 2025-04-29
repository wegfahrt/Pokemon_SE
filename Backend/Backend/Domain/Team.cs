using ErrorOr;

namespace Domain
{
    public class Team
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public int TrainerId { get; private set; }
        
        private readonly List<ConfiguredPokemon> _pokemon = new();
        public IReadOnlyCollection<ConfiguredPokemon> Pokemon => _pokemon.AsReadOnly();
        
        // Domain behavior with proper validations
        public ErrorOr<Success> AddPokemon(ConfiguredPokemon pokemon)
        {
            if (_pokemon.Count >= 6)
                return Error.Conflict(description:"A team cannot have more than 6 Pokémon");
                
            _pokemon.Add(pokemon);
            return Result.Success;
        }
        
    }
}