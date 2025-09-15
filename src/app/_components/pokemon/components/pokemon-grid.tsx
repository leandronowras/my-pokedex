import { Card, CardContent } from "~/app/_components/ui/card"
import { Button } from "~/app/_components/ui/button"

export interface PokemonMin {
  id: number | string;
}

type PokemonGridProps = any

export function PokemonGrid({
  filteredPokemon,
  hasActiveFilters,
  onClearFilters,
  PokemonCardComponent,
  className,
}: PokemonGridProps) {
  const isEmpty = filteredPokemon.length === 0;

  if (isEmpty) {
    return (
      <div className={className}>
        <Card role="status" aria-live="polite">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No Pokémon found matching your criteria.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="mt-4 bg-transparent"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={["grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className]
        .filter(Boolean)
        .join(" ")}
      role="list"
      aria-label="Filtered Pokémon"
    >
      {filteredPokemon.map((poke: any) => (
        <PokemonCardComponent key={poke.id} pokemon={poke} />
      ))}
    </div>
  );
}
