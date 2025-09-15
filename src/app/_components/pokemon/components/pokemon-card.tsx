import Link from "next/link";
import { Card, CardContent } from "~/app/_components/ui/card"; // adjust if your ui path is different
import { Badge } from "~/app/_components/ui/badge";
import type { Pokemon } from "src/lib/types"
import { typeColors } from "src/lib/constants"

interface PokemonWithDetails extends Pokemon {
  generation: string
  evolutionChain: string[]
}

export function PokemonCard({ pokemon }: { pokemon: PokemonWithDetails }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            {/* Pokemon Image */}
            <div className="relative">
              <img
                src={pokemon?.sprites?.other["official-artwork"]?.front_default || pokemon?.sprites?.front_default}
                alt={pokemon?.name}
                className="w-24 h-24 mx-auto object-contain group-hover:scale-110 transition-transform"
              />
              <div className="absolute top-0 right-0 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                #{pokemon.id.toString().padStart(3, "0")}
              </div>
            </div>

            {/* Pokemon Name */}
            <h3 className="font-semibold text-lg capitalize text-foreground">{pokemon.name.replace("-", " ")}</h3>

            {/* Generation */}
            <Badge variant="outline" className="text-xs">
              {pokemon.generation}
            </Badge>

            {/* Types */}
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemon.types.map((type: any, idx: any) => (
                <Badge
                  key={idx}
                  className={`text-white text-xs ${typeColors[type] || "bg-gray-400 dark:bg-gray-500"}`}
                >
                  {type}
                </Badge>
              ))}
            </div>

            {/* Basic Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Height: {pokemon.height / 10}m</div>
              <div>Weight: {pokemon.weight / 10}kg</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
