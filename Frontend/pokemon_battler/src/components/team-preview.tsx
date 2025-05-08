"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TeamPreviewProps {
  team: any[]
  onRemove: (id: number) => void
  onSelect: (pokemon: any) => void
}

export default function TeamPreview({ team, onRemove, onSelect }: TeamPreviewProps) {
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

  const emptySlots = Array(6 - team.length).fill(null)

  return (
    <div className="grid grid-cols-2 gap-3">
      {team.map((pokemon) => (
        <div
          key={pokemon.id}
          className="flex items-center p-2 border rounded-md bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={() => onSelect(pokemon)}
        >
          <div className="relative w-12 h-12 mr-2 flex-shrink-0">
            <img
              src={pokemon.sprite || "/placeholder.svg"}
              alt={pokemon.name}
              className="object-contain"
              style={{ width: '100%', height: 'auto' }} // Use width and height styles to control size
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{pokemon.name}</h4>
            <div className="flex gap-1 mt-1">
              {pokemon.types.map((type: string) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className={cn("text-white text-[10px] px-1 py-0", typeColors[type.toLowerCase()] || "bg-gray-500")}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-1 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(pokemon.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}

      {emptySlots.map((_, index) => (
        <div
          key={`empty-${index}`}
          className="flex items-center justify-center p-2 border rounded-md border-dashed h-[72px] bg-slate-50 dark:bg-slate-800/50"
        >
          <span className="text-xs text-muted-foreground">Empty slot</span>
        </div>
      ))}
    </div>
  )
}
