"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Save, Download } from "lucide-react"
import PokemonCard from "@/components/pokemon-card"
import TeamPreview from "@/components/team-preview"
import PokemonDetails from "@/components/pokemon-details"
import { mockPokemonList } from "@/lib/mock-data"
import { Pokemon } from "@/lib/types"

export default function TeamBuilder() {
  const [team, setTeam] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  const filteredPokemon = mockPokemonList.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.types.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addToTeam = (pokemon: any) => {
    if (team.length < 6) {
      setTeam([...team, { ...pokemon, id: Date.now() }])
    }
  }

  const removeFromTeam = (id: number) => {
    setTeam(team.filter((pokemon) => pokemon.id !== id))
  }

  const selectPokemon = (pokemon: any) => {
    setSelectedPokemon(pokemon)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-8 shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="pokemon" className="w-full">
            <TabsList className="grid grid-cols-1 mb-4">
              <TabsTrigger value="pokemon">Pokémon</TabsTrigger>
            </TabsList>

            <TabsContent value="pokemon" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Pokémon or type..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>

              <ScrollArea className="h-[500px] rounded-md border">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                  {filteredPokemon.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.pdx_num}
                      pokemon={pokemon}
                      onAdd={() => addToTeam(pokemon)}
                      onSelect={() => selectPokemon(pokemon)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="lg:col-span-4 space-y-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Your Team</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Load
                </Button>
              </div>
            </div>

            <TeamPreview team={team} onRemove={removeFromTeam} onSelect={selectPokemon} />

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">{team.length}/6 Pokémon selected</p>
            </div>
          </CardContent>
        </Card>

        {selectedPokemon && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <PokemonDetails pokemon={selectedPokemon} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
