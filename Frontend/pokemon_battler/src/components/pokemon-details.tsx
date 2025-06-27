import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { Pokemon, Ivs, Evs, Moves, Ability } from "@/lib/types"

export default function PokemonDetails({ pokemon }: { pokemon: Pokemon }) {
  // State to manage IVs, EVs, moveset, and ability
  const [, setIvs] = useState<Ivs[]>([])
  const [evs, setEvs] = useState<Evs[]>([])
  const [moveset, setMoveset] = useState<(Moves | null)[]>([null, null, null, null])
  const [ability, setAbility] = useState<Ability | null>(null)

  // Effect Hook to initialize IVs, EVs, moveset, and ability when the pokemon prop changes
  useEffect(() => {
    if (pokemon) {
      setIvs(pokemon.ivs ? [...pokemon.ivs] : [])
      setEvs(pokemon.evs ? [...pokemon.evs] : [])
      setMoveset(pokemon.moveset ? [...pokemon.moveset] : [null, null, null, null])
      setAbility(pokemon.ability || null)
    }
  }, [pokemon])

  // Define colors for different Pokémon types
  const typeColors: Record<string, string> = {
    normal: "bg-stone-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-red-700",
    poison: "bg-purple-600",
    ground: "bg-amber-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-purple-800",
    dragon: "bg-violet-700",
    dark: "bg-stone-700",
    steel: "bg-slate-400",
    fairy: "bg-pink-300",
  }

  // Function to determine the color of the stat progress bar based on the value
  const getStatColor = (value: number) => {
    if (value < 50) return "bg-red-500"
    if (value < 80) return "bg-yellow-500"
    if (value < 120) return "bg-green-500"
    return "bg-blue-500"
  }

  // Function to update IVs
  const updateIV = (stat: string, value: number[]) => {
    if (!pokemon.ivs) return
    // Find the IV object for the given stat and update its value
    const ivObj = pokemon.ivs.find((iv) => iv.getName() === stat)
    if (ivObj) {
      try {
        ivObj.setValue(value[0])
        setIvs([...pokemon.ivs])
      } catch (error) {
        console.error("Error updating IV:", error)
      }
    }
  }

  // Function to update EVs
  const updateEV = (stat: string, value: number[]) => {
    if (!pokemon.evs) return
    // Find the EV object for the given stat and update its value
    const evObj = pokemon.evs.find((ev) => ev.getName() === stat)
    if (evObj) {
      evObj.setValue(value[0])
      setEvs([...pokemon.evs])
    }
  }

  // Function to remove a move from the moveset
  const removeMove = (index: number) => {
    if (index < 0 || index >= 4) return
    const newMoveset = [...moveset]
    newMoveset[index] = null
    setMoveset(newMoveset)
    pokemon.setMoveset(index, null)
  }

  // Function to add a move to the moveset
  const addMove = (move: Moves) => {
    const emptyIndex = moveset.indexOf(null);
    if (emptyIndex !== -1) {
      const newMoveset = [...moveset];
      newMoveset[emptyIndex] = move;
      setMoveset(newMoveset);
      pokemon.setMoveset(emptyIndex, move);
    }
  };

  // Function to update the selected ability
  const updateAbility = (ability: Ability) => {
    pokemon.setAbility(ability)
    setAbility(ability)
  }

  // Calculate total EVs and remaining EVs
  const totalEVs = evs.reduce((sum, ev) => sum + (ev?.getValue() || 0), 0)
  const remainingEVs = Math.max(0, 508 - totalEVs)
  // If no Pokémon is provided, return a message
  if (!pokemon) {
    return <div className="p-4 text-center text-muted-foreground">No Pokemon selected</div>
  }
  // Extract Pokémon details with fallback values
  const pokemonName = pokemon.name || "Unknown"
  const pokemonTypes = pokemon.types || []
  const pokemonSprite = pokemon.sprite || "/placeholder.svg?height=80&width=80"
  const pokemonStats = pokemon.stats || []
  const pokemonMoves = pokemon.moves || []
  const pokemonAbilities = pokemon.abilitys || []

  return (
    <div className="p-1">
      <div className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4">
          {/* Pokémon sprite image with error handling */}
          <img
            src={pokemonSprite || "/placeholder.svg"}
            alt={pokemonName}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=80&width=80"
            }}
          />
        </div>
        <div>
          {/* Pokémon name and types */}
          <h3 className="text-2xl font-bold">{pokemonName}</h3>
          <div className="flex gap-1 mt-1">
            {pokemonTypes.map((type: string) => (
              <Badge
                key={type}
                variant="secondary"
                className={cn("text-white", typeColors[type.toLowerCase()] || "bg-gray-500")}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs for different Pokémon details */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="ivev">IVs/EVs</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
        </TabsList>

        {/* Pokémon stats tab content */}
        <TabsContent value="stats" className="space-y-4">
          {/* Display each stat with its name and value in a bar graph with 255 being the maximal value*/}
          {Object.entries(pokemonStats
          ).map(([stat, value]: [string, any]) => (
            <div key={stat} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{value.name || value}</span>
                <span className="font-medium">{value.basestat || value}</span>
              </div>
              <Progress value={(value.basestat / 255) * 100 || value} max={255} className="h-2" indicatorClassName={getStatColor(value.basestat || value)} />
            </div>
          ))}
        </TabsContent>

        {/* Individual Values (IVs) and Effort Values (EVs) tab content */}
        <TabsContent value="ivev" className="space-y-6">
          <div>
            {/* Display total IVs as a slider */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Individual Values (IVs)</h4>
              <span className="text-xs text-muted-foreground">Max: 31</span>
            </div>
            {pokemon.ivs?.map((ivObj) => (
              <div key={ivObj.getName()} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="capitalize">{ivObj.getName()}</span>
                  <span className="font-medium">{ivObj.getValue()}</span>
                </div>
                <Slider
                  value={[ivObj.getValue()]}
                  min={0}
                  max={31}
                  step={1}
                  onValueChange={(value) => updateIV(ivObj.getName(), value)}
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              {/* Display total EVs and remaining EVs as a number */}
              <h4 className="font-semibold text-lg">Effort Values (EVs)</h4>
              <span className={`text-xs ${remainingEVs < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                Remaining: {remainingEVs}/508
              </span>
            </div>
            {/* Display the Evs for each indiviual Stat as a slider bar */}
            {pokemon.evs?.map((evObj) => (
              <div key={evObj.getName()} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="capitalize">{evObj.getName()}</span>
                  <span className="font-medium">{evObj.getValue()}</span>
                </div>
                <Slider
                  value={[evObj.getValue()]}
                  min={0}
                  max={252}
                  step={1}
                  onValueChange={(value) => {
                    const temp = value[0] - evObj.getValue();
                    if (temp <= remainingEVs) {
                      updateEV(evObj.getName(), value)
                    }
                    else {
                      updateEV(evObj.getName(), [evObj.getValue() + remainingEVs])
                    }
                  }
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Moves tab content */}
        <TabsContent value="moves" className="space-y-4">
          <div>
            {/* Display selected moves from the pokemon*/}
            <h4 className="font-semibold text-lg mb-3">Selected Moves ({moveset.filter(Boolean).length}/4)</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {moveset.map((move, index) => (
                <div
                  key={move?.name ?? `empty-${index}`}
                  className="p-2 border rounded-md bg-slate-50 dark:bg-slate-800 flex justify-between items-center"
                >
                  {move ? (
                    <>
                      <span>{move.name}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeMove(index)}>
                        <span className="sr-only">Remove move</span>
                        ✕
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Empty slot</span>
                  )}
                </div>
              ))}
            </div>
            <div>
              {/* Display available moves from the pokemon */}
              <h4 className="font-semibold text-lg mb-3">Available Moves</h4>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {pokemonMoves.map((move: Moves) => {
                  const isSelected = moveset.some((m) => m?.name === move.name)
                  const currentMoveCount = moveset.filter(Boolean).length
                  return (
                    <div
                      key={move.name}
                      className={cn(
                        "p-2 border rounded-md flex justify-between items-center cursor-pointer",
                        isSelected ? "bg-green-100" : "bg-slate-50 dark:bg-slate-800",
                      )}
                      onClick={() => addMove(move)}>
                      <span className="truncate max-w-[120px]">{move.name}</span>
                      {
                        // Show badge if the move is selected or if max moves are reached
                        isSelected ? (
                          <Badge variant="outline" className="ml-2 whitespace-nowrap text-xs px-2 py-0.5">
                            Selected
                          </Badge>
                        ) : currentMoveCount >= 4 ? (
                          <Badge variant="outline" className="bg-slate-200 dark:bg-slate-800 ml-2 text-xs px-2 py-0.5">
                            Max
                          </Badge>
                        ) : null
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Abilities tab content */}
        <TabsContent value="abilities" className="space-y-3">
          { /* Display selected ability green from the pokemon */}
          {pokemonAbilities.map((Ability) => {
            const isSelected = ability?.getName() === Ability.getName();
            return (
              <div key={Ability.getName()} className={cn("p-3 border rounded-md cursor-pointer", isSelected ? "bg-green-100" : null)} onClick={() => updateAbility(Ability)}>
                <h4 className="font-medium">{Ability.getName()}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {Ability.getEffect()}
                </p>
              </div>
            )
          })}
        </TabsContent>
      </Tabs>
    </div >
  )
}
