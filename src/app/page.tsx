import { Suspense } from "react"
import PokemonSearch from "~/app/_components/pokemon/components/pokemon-search"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"

import { HydrateClient } from "~/trpc/server"

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Pokédex</h1>
            <p className="text-muted-foreground text-lg">
              Explore the world of Pokémon with data from the Poké API
            </p>
          </div>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Loading Pokémon...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <PokemonSearch />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  )
}

