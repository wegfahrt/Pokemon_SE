import TeamBuilder from "@/components/team-builder"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Pokémon Team Builder</h1>
        <TeamBuilder />
      </div>
    </div>
  )
}
