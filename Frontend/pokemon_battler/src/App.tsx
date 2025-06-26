"use client"

import TeamBuilder from "@/components/team-builder"
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { mockPokemonList } from "./lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedPokeballIcon, PokeballIcon, PremiumPokeballIcon } from "./components/ui/pokeball-icon"
import { Users, Trophy, Star, Sparkles, Shield, Target } from "lucide-react"
import { fetchPokemonDataAndConvert } from "./lib/utils"
import { useEffect, useState } from "react"
import type { Pokemon } from "./lib/types"
// Import the environment variable for Clerk's publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Ensure the publishable key is defined
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function HomePage() {
  // Throw an error if the publishable key is not set
  const [allPokemon, setAllPokemon] = useState<Pokemon[] | null>(null)

  useEffect(() => {
    fetchPokemonDataAndConvert()
      .then(setAllPokemon)
      .catch((error) => {
        console.error("Fehler beim Laden der Pokémon-Daten:", error)
        setAllPokemon([])
      })
  }, [])

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PokeballIcon size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Clerk Publishable Key is missing. Please check your environment configuration.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" >
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <SignedOut>
          {/* This is the Welcome Screen for when an unauthenticated user visits the site */}
          {/* Welcome Screen */}
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="container mx-auto px-4 py-8">
              <div className="text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      {/* This defines the Pokeball icon appearing next to the Title */}
                      <PremiumPokeballIcon size={32} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    {/* This defines the Title and Subtitle of the Welcome Screen */}
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Pokémon
                    </h1>
                    <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Team Builder</h2>
                  </div>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Create the ultimate Pokémon team with advanced stat optimization, strategic movesets, and competitive
                  analysis. Join and become a Trainer, building championship-worthy teams.
                </p>
              </div>
            </header>

            {/* Features Section */}
            <main className="flex-1 container mx-auto px-4 pb-8">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    {/* This defines the Subchapters under the Title */}
                    <CardTitle className="text-xl font-bold">Strategic Team Building</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Choose from all Pokémon in Generation I to IV and create perfectly balanced teams with synergistic
                      abilities, type coverage, and strategic roles.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    {/* This defines the Subchapters under the Title */}
                    <CardTitle className="text-xl font-bold">Advanced Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Fine-tune Individual Values (IVs) and Effort Values (EVs) with precision. Optimize stats for
                      maximum competitive potential and tournament readiness.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    {/* This defines the Subchapters under the Title */}
                    <CardTitle className="text-xl font-bold">Battle Ready Export</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Save multiple team configurations, analyze type effectiveness, and export teams for competitive
                      battles.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              {/* With this Button the Login Process provided by Clerk is initiated */}
              <div className="max-w-lg mx-auto">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-800/95 dark:to-slate-900/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <PremiumPokeballIcon size={40} className="text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3">Ready to Become a Champion?</CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Join the elite trainers and start building your legendary team today
                    </p>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <SignInButton mode="modal">
                      <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        <PokeballIcon size={20} className="mr-3" />
                        Start Your Journey
                      </Button>
                    </SignInButton>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Free Forever</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PokeballIcon size={16} className="text-blue-500" />
                        <span>Instant Access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center">
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <p className="text-slate-500 dark:text-slate-400">
                </p>
              </div>
            </footer>
          </div>
        </SignedOut>

        {/* This is the Main Application for when an authenticated user visits the site */}
        <SignedIn>
          {/* Navigation Header */}
          <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <AnimatedPokeballIcon size={20} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Pokémon Team Builder
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Championship Edition</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Welcome back, Champion!
                    </span>
                  </div>
                  {/* This defines the User Button for the authenticated user and a click opens an account menu provided by Clerk */}
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 shadow-lg",
                        userButtonPopoverCard: "shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm",
                        userButtonPopoverActionButton: "hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                      },
                    }}
                    showName={false}
                  />
                </div>
              </div>
            </div>
          </header>
          {/* Main Content */}
          <main>
            {!allPokemon ? (
              <div className="text-center text-slate-500 mt-20">Lade Pokémon-Daten...</div>
            ) : (
              <TeamBuilder pokemonList={allPokemon} />
            )}
          </main>
        </SignedIn>
      </ClerkProvider>
    </div >
  )
}





