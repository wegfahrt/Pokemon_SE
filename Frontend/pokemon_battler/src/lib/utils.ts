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

        const types = pokemon.types.map((typeEntry: any) => typeEntry.type.name)
        const spriteUrl = pokemon.sprites.front_default

        const rawData: RawPokemonData = {
          id: pokemon.id,
          name: pokemon.name,
          types,
          spriteUrl,
        }

        return rawData
      })
    )

    const pokemonList = convertToPokemonClass(detailedData)

    // Testausgabe
    pokemonList.forEach((poke) => {
      console.log(`${poke.getName()} (ID: ${poke.getPdx_num()}) - Typen: ${poke.getTypes().join(', ')}`)
    })

    return pokemonList
  } catch (error) {
    console.error('Fehler beim Abrufen der Pokémon-Daten:', error)
    return []
  }
}