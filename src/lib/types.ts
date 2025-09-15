export interface Pokemon {
  id: number
  name: string
  url: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: PokemonType[]
  stats: PokemonStat[]
  species: {
    name: string
    url: string
  }
  height: number
  weight: number
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonSpecies {
  id: number
  name: string
  generation: {
    name: string
    url: string
  }
  evolution_chain: {
    url: string
  }
}

export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionChainLink {
  is_baby: boolean
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
}

export interface Generation {
  id: number
  name: string
  pokemon_species: Array<{
    name: string
    url: string
  }>
}

export interface Type {
  id: number
  name: string
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
  }>
}

// Enhanced types for our app
export interface EnhancedPokemon extends Pokemon {
  generation: string
  evolutionChain?: string[]
}

