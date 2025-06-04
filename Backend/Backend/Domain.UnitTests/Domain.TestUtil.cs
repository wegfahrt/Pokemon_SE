using Domain.Interfaces;

namespace Domain.UnitTests;

public class DomainTestUtil
{
    public static ConfiguredPokemon CreateValidConfiguredPokemon()
    {
        var request = CreateValidPokemonRequest();
        return ConfiguredPokemon.CreateFromRequest(request).Value;
    }

    public static ConfiguredMove CreateValidConfiguredMove(int moveId)
    {
        var moveRequest = new MoveRequest(moveId);
        return ConfiguredMove.CreateFromRequest(moveRequest).Value;
    }

    public static PokemonRequest CreateValidPokemonRequest()
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85, // Total: 510
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithName(string name)
    {
        return new PokemonRequest(
            name,
            100,
            55,
            40,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithHp(int hp)
    {
        return new PokemonRequest(
            "Pikachu",
            hp,
            55,
            40,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithAttack(int attack)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            attack,
            40,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithDefense(int defense)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            defense,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithSpecialAttack(int specialAttack)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            specialAttack,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithSpecialDefense(int specialDefense)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            specialDefense,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithSpeed(int speed)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            50,
            speed,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithAbilityId(int abilityId)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            50,
            90,
            abilityId,
            31,
            31,
            31,
            31,
            31,
            31,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithIVs(int hpIv, int attackIv, int defenseIv, int specialAttackIv,
        int specialDefenseIv, int speedIv)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            50,
            90,
            1,
            hpIv,
            attackIv,
            defenseIv,
            specialAttackIv,
            specialDefenseIv,
            speedIv,
            85,
            85,
            85,
            85,
            85,
            85,
            new List<MoveRequest>()
        );
    }

    public static PokemonRequest CreatePokemonRequestWithEVs(int hpEv, int attackEv, int defenseEv, int specialAttackEv,
        int specialDefenseEv, int speedEv)
    {
        return new PokemonRequest(
            "Pikachu",
            100,
            55,
            40,
            50,
            50,
            90,
            1,
            31,
            31,
            31,
            31,
            31,
            31,
            hpEv,
            attackEv,
            defenseEv,
            specialAttackEv,
            specialDefenseEv,
            speedEv,
            new List<MoveRequest>()
        );
    }
}