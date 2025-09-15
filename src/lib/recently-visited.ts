interface RecentPokemon {
  id: number
  name: string
  sprite: string
  types: string[]
  visitedAt: number
}

export function addToRecentlyVisited(pokemon: {
  id: number
  name: string
  sprite: string
  types: string[]
}) {
  if (typeof window === "undefined") return

  const maxRecent = 12
  const storageKey = "recentlyVisitedPokemon"

  try {
    const existing = localStorage.getItem(storageKey)
    let recentPokemon: RecentPokemon[] = existing ? JSON.parse(existing) : []

    // Remove existing entry for this Pokemon if it exists
    recentPokemon = recentPokemon.filter((p) => p.id !== pokemon.id)

    // Add new entry at the beginning
    recentPokemon.unshift({
      ...pokemon,
      visitedAt: Date.now(),
    })

    // Keep only the most recent entries
    recentPokemon = recentPokemon.slice(0, maxRecent)

    localStorage.setItem(storageKey, JSON.stringify(recentPokemon))
  } catch (error) {
    console.error("Failed to save recently visited Pokemon:", error)
  }
}

