import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { Pokemon, Ivs, Evs, Moves, Ability } from "@/lib/types"

export default function PokemonDetails({ pokemon }: { pokemon: Pokemon }) {
  const [ivs, setIvs] = useState<Ivs[]>([])
  const [evs, setEvs] = useState<Evs[]>([])
  const [moveset, setMoveset] = useState<(Moves | null)[]>([...pokemon.moveset])
  const [abilitys, setAbilitys] = useState(pokemon.ability)

  useEffect(() => {
    setIvs([...pokemon.ivs])
    setEvs([...pokemon.evs])
    setMoveset([...pokemon.moveset])
    setAbilitys(pokemon.ability)
  }
    , [pokemon])

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

  const getStatColor = (value: number) => {
    if (value < 50) return "bg-red-500"
    if (value < 80) return "bg-yellow-500"
    if (value < 120) return "bg-green-500"
    return "bg-blue-500"
  }

  const updateIV = (stat: string, value: number[]) => {
    const ivs = pokemon.ivs.find((ivs) => ivs.getName() === stat)
    if (ivs) {
      ivs.setValue(value[0])
      setIvs([...pokemon.ivs])
    }
  }

  const updateEV = (stat: string, value: number[]) => {
    const evs = pokemon.evs.find((evs) => evs.getName() === stat)
    if (evs) {
      evs.setValue(value[0])
      setEvs([...pokemon.evs]);
    }
  }

  const removeMove = (index: number) => {
    const newMoveset = [...moveset]
    newMoveset[index] = null
    setMoveset(newMoveset)
    pokemon.setMoveset(index, null)
  }

  const addMove = (move: Moves) => {
    const emptyIndex = moveset.indexOf(null);
    if (emptyIndex !== -1) {
      const newMoveset = [...moveset];
      newMoveset[emptyIndex] = move;
      setMoveset(newMoveset);
      pokemon.setMoveset(emptyIndex, move);
    }
  };

  const updateAbility = (ability: Ability) => {
    pokemon.setAbility(ability)
    setAbilitys(ability)
  }
  console.log("pokemon", pokemon)

  const totalEVs = Object.values(evs).reduce((sum, ev) => sum + ev.getValue(), 0)
  const remainingEVs = 508 - totalEVs
  return (
    <div className="p-1">
      <div className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4">
          <img
            src={pokemon.sprite || "/placeholder.svg"}
            alt={pokemon.name}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold">{pokemon.name}</h3>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map((type: string) => (
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

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="ivev">IVs/EVs</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          {Object.entries(pokemon.stats).map(([stat, value]: [string, any]) => (
            <div key={stat} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{value.name || value}</span>
                <span className="font-medium">{value.basestat || value}</span>
              </div>
              <Progress value={value.basestat || value} max={255} className="h-2" indicatorClassName={getStatColor(value.basestat || value)} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ivev" className="space-y-6">
          <div>
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
              <h4 className="font-semibold text-lg">Effort Values (EVs)</h4>
              <span className={`text-xs ${remainingEVs < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                Remaining: {remainingEVs}/508
              </span>
            </div>
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

        <TabsContent value="moves" className="space-y-4">
          <div>
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
              <h4 className="font-semibold text-lg mb-3">Available Moves</h4>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {pokemon.moves.map((move: Moves) => {
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

        <TabsContent value="abilities" className="space-y-3">
          {pokemon.abilitys.map((Ability) => {
            const isSelected = pokemon.ability?.getName() === Ability.getName();
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
