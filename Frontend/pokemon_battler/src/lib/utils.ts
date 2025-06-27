import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Pokemon, Ivs, Evs, Moves, Ability, Stats } from "./types"
import axios from "axios"
// This utility function combines class names and merges them intelligently.
// It uses clsx to handle conditional class names and tailwind-merge to resolve conflicts.
// It allows you to pass any number of class names as arguments and returns a single string with the merged class names.
/**
 * Combines class names and merges them intelligently.
 * @param inputs - The class names to combine.
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
function firstCapitalize(str: string): string {
  // Capitalizes the first letter of a string
  if (str.includes("-")) {
    const pindex = str.indexOf("-")
    const name = str.slice(0, pindex)
    const form = str.slice(pindex + 1)
    // If the string contains hyphens, capitalize the first part and join with the rest
    return name.charAt(0).toUpperCase() + name.slice(1) + " (" + form.charAt(0).toUpperCase() + form.slice(1) + ")"
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatMoveName(name: string): string {
  // Formats the move name by capitalizing the first letter and replacing hyphens with spaces
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, "")
}


interface RawPokemonData {
  id: number
  name: string
  types: string[]
  spriteUrl: string
}

export function convertToPokemonClass(data: RawPokemonData[]): Pokemon[] {
  return data.map((entry) => {
    return new Pokemon(
      entry.id,
      entry.name,
      null,
      [new Ability("Error", "If this appears, something went wrong")],
      100,
      "Male",
      "Hardy",
      false,
      entry.types,
      [
        new Ivs("hp", 31),
        new Ivs("attack", 31),
        new Ivs("defense", 31),
        new Ivs("special-attack", 31),
        new Ivs("special-defense", 31),
        new Ivs("speed", 31),
      ],
      [
        new Evs("hp", 0),
        new Evs("attack", 0),
        new Evs("defense", 0),
        new Evs("special-attack", 0),
        new Evs("special-defense", 0),
        new Evs("speed", 0),
      ],
      [
        new Stats("hp", 1),
        new Stats("attack", 1),
        new Stats("defense", 1),
        new Stats("special-attack", 1),
        new Stats("special-defense", 1),
        new Stats("speed", 1),
      ],
      [new Moves("Error", "Normal", 1, 1, 1, "Physical")],
      [null, null, null, null],
      entry.spriteUrl,
      "Empty",
    )
  })
}
export async function fetchPokemonDataAndConvert() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=493&page=0')
    // const response = await axios.get("https://localhost:7250/PokemonApi/Pokemon?limit=20&page=0")
    const results = response.data.results as { name: string; url: string }[]

    // Hole detaillierte Daten zu jedem Pokémon
    const detailedData = await Promise.all(
      results.map(async (entry) => {

        const res = await axios.get(entry.url)
        const pokemon = res.data

        const types = pokemon.types.map((typeEntry: any) => firstCapitalize(typeEntry.type.name))
        const spriteUrl = pokemon.sprites.front_default

        const rawData: RawPokemonData = {
          id: pokemon.id,
          name: firstCapitalize(pokemon.name),
          types: types,
          spriteUrl,
        }

        return rawData
      })
    )

    const pokemonList = convertToPokemonClass(detailedData)

    return pokemonList
  } catch (error) {
    console.error('Fehler beim Abrufen der Pokémon-Daten:', error)
    return []
  }
}
export async function fetchSpecificPokemonData(pokemon: Pokemon): Promise<null> {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.getName().toLowerCase()}`)
    const data = response.data

    const abilities: Ability[] = await Promise.all(
      data.abilities.map(async (entry: any) => {
        const abilityRes = await axios.get(entry.ability.url)
        const effect = abilityRes.data.effect_entries.find((e: any) => e.language.name === 'en')
        return new Ability(firstCapitalize(entry.ability.name), effect?.effect || 'No description')
      })
    )

    // Stats
    const stats: Stats[] = data.stats.map(
      (entry: any) => new Stats(entry.stat.name, entry.base_stat)
    )

    // Moves – max. 4
    const moveData = data.moves.slice(0, 100)
    const moves: Moves[] = await Promise.all(
      moveData.map(async (entry: any) => {
        const moveRes = await axios.get(entry.move.url)
        const move = moveRes.data
        return new Moves(
          formatMoveName(move.name),
          firstCapitalize(move.type.name),
          move.power ?? 0,
          move.accuracy ?? 100,
          move.pp ?? 10,
          move.damage_class.name
        )
      })
    )

    pokemon.setAbilitys(abilities)
    pokemon.setStats(stats)
    pokemon.setMoves(moves)
    pokemon.setSprite(data.sprites.front_default)
    pokemon.setSprite_back(data.sprites.back_default)


    return null
  } catch (error) {
    console.error('Fehler beim Abrufen der Pokémon-Daten:', error)
    return null
  }
}