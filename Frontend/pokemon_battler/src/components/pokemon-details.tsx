import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface PokemonDetailsProps {
  pokemon: any
}

export default function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const [selectedMoves, setSelectedMoves] = useState<string[]>([])
  const [ivs, setIvs] = useState({
    hp: 31,
    attack: 31,
    defense: 31,
    "special-attack": 31,
    "special-defense": 31,
    speed: 31,
  })
  const [evs, setEvs] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    "special-attack": 0,
    "special-defense": 0,
    speed: 0,
  })

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

  const toggleMove = (move: string) => {
    if (selectedMoves.includes(move)) {
      setSelectedMoves(selectedMoves.filter((m) => m !== move))
    } else if (selectedMoves.length < 4) {
      setSelectedMoves([...selectedMoves, move])
    }
  }

  const updateIV = (stat: string, value: number[]) => {
    setIvs({ ...ivs, [stat]: value[0] })
  }

  const updateEV = (stat: string, value: number[]) => {
    setEvs({ ...evs, [stat]: value[0] })
  }

  const totalEVs = Object.values(evs).reduce((sum, value) => sum + value, 0)
  const remainingEVs = 510 - totalEVs

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
                <span className="capitalize">{stat.replace("-", " ")}</span>
                <span className="font-medium">{value}</span>
              </div>
              <Progress value={value} max={255} className={cn("h-2", getStatColor(value))} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ivev" className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Individual Values (IVs)</h4>
              <span className="text-xs text-muted-foreground">Max: 31</span>
            </div>
            {Object.entries(ivs).map(([stat, value]) => (
              <div key={stat} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="capitalize">{stat.replace("-", " ")}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <Slider value={[value]} min={0} max={31} step={1} onValueChange={(value) => updateIV(stat, value)} />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Effort Values (EVs)</h4>
              <span className={`text-xs ${remainingEVs < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                Remaining: {remainingEVs}/510
              </span>
            </div>
            {Object.entries(evs).map(([stat, value]) => (
              <div key={stat} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="capitalize">{stat.replace("-", " ")}</span>
                  <span className="font-medium">{value}/252</span>
                </div>
                <Slider
                  value={[value]}
                  min={0}
                  max={252}
                  step={4}
                  onValueChange={(value) => updateEV(stat, value)}
                  className={totalEVs > 510 ? "bg-red-100" : ""}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moves" className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-3">Selected Moves ({selectedMoves.length}/4)</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedMoves.map((move, index) => (
                <div
                  key={index}
                  className="p-2 border rounded-md bg-slate-50 dark:bg-slate-800 flex justify-between items-center"
                >
                  <span>{move}</span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleMove(move)}>
                    ✕
                  </Button>
                </div>
              ))}
              {Array(4 - selectedMoves.length)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-2 border border-dashed rounded-md text-center text-muted-foreground"
                  >
                    <span className="text-sm">Empty slot</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Available Moves</h4>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
              {pokemon.moves.map((move: string, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 border rounded-md text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-between items-center",
                    selectedMoves.includes(move) ? "bg-slate-100 dark:bg-slate-700 border-primary" : "",
                  )}
                  onClick={() => toggleMove(move)}
                >
                  <span>{move}</span>
                  {selectedMoves.includes(move) ? (
                    <Badge variant="outline" className="ml-2">
                      Selected
                    </Badge>
                  ) : selectedMoves.length >= 4 ? (
                    <Badge variant="outline" className="bg-slate-200 dark:bg-slate-800 ml-2">
                      Max
                    </Badge>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abilities" className="space-y-3">
          {pokemon.abilities.map((ability: string, index: number) => (
            <div key={index} className="p-3 border rounded-md">
              <h4 className="font-medium">{ability}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {/* In a real app, you would have descriptions for each ability */}
                This is a description of what the {ability} ability does in battle.
              </p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
