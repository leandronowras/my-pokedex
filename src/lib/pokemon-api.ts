import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  Generation,
  Type,
  EnhancedPokemon,
} from "./types"

export const BASE_URL = "https://pokeapi.co/api/v2"

export const cache = new Map<string, any>()
const MAX_CACHE_SIZE = 500

function touch(key: string) {
  if (!cache.has(key)) return
  const val = cache.get(key)
  cache.delete(key)
  cache.set(key, val!)
}

/** Evict the least-recently used entry when size exceeds limit */
function maybeEvict() {
  while (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value as string | undefined
    if (oldestKey) cache.delete(oldestKey)
    else break
  }
}

export async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    const value = cache.get(url) as T
    // mark as recently used
    touch(url)
    return value
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as T

  // About to add new info to cache: if we're at/over limit, evict oldest first
  maybeEvict()
  cache.set(url, data)

  //console.log("cache", cache)

  return data
}

// Helpers if you need them elsewhere:
export function clearCache() {
  cache.clear()
}

export function cacheSize() {
  return cache.size
}


export async function getAllPokemon(limit = 1010): Promise<PokemonListResponse> {
  return fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}`)
}

export async function getNewAllPokemon(
  currentPage: number,
  itemsPerPageInit: number,
  itemsPerPageEnd: number
): Promise<any> {
  const limit = 50
  let offset = (currentPage - 1) * limit
  if (offset > 1301) {
    offset = 1301
  }
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

  return response.json()
}

export async function MyDynamicFetch(
  currentPage: number,
  itemsPerPageInit: number,
  itemsPerPageEnd: number
): Promise<PokemonListResponse> {
  const limit = itemsPerPageEnd - itemsPerPageInit
  const offset = (currentPage - 1) * limit

  const url = `${BASE_URL}/pokemon?limit=${limit + 50}&offset=${offset}`

  // Will use cache if present, otherwise fetch and cache
  const data = await fetchWithCache<PokemonListResponse>(url)

  return data
}

export async function MyAllPokemons(): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${10000}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }

  const data = await response.json()
  return data.count
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  return fetchWithCache(`${BASE_URL}/pokemon/${nameOrId}`)
}

export async function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  if (typeof nameOrId === 'number' && (nameOrId < 1 || nameOrId > 1025)) {
    return fetchWithCache(`${BASE_URL}/pokemon-species/1025`)
  }
  return fetchWithCache(`${BASE_URL}/pokemon-species/${nameOrId}`)
}

export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
  return fetchWithCache(`${BASE_URL}/evolution-chain/${id}`)
}

export async function getAllGenerations(): Promise<Generation[]> {
  const response = await fetchWithCache<{ results: Array<{ name: string; url: string }> }>(`${BASE_URL}/generation`)
  const generations = await Promise.all(response.results.map((gen) => fetchWithCache<Generation>(gen.url)))
  return generations.sort((a, b) => a.id - b.id)
}

export async function getAllTypes(): Promise<Type[]> {
  const response = await fetchWithCache<{ results: Array<{ name: string; url: string }> }>(`${BASE_URL}/type`)
  const types = await Promise.all(response.results.map((type) => fetchWithCache<Type>(type.url)))
  return types.filter((type) => type.id <= 18) // Only main types, exclude special types
}

// Helper function to get Pokemon ID from URL
export function getPokemonIdFromUrl(url: string): number {
  if (!url) {
    return 1
  }
  const matches = url?.match(/\/pokemon\/(\d+)\//)
  return matches ? Number.parseInt(matches[1]!) : 0
}

// Helper function to get generation name in readable format
export function formatGenerationName(generationName: string): string {
  const genNumber = generationName?.replace("generation-", "").toUpperCase()
  return `Gen ${genNumber}`
}

// Helper function to get evolution chain from species URL
export function getEvolutionChainIdFromUrl(url: string): number {
  if (!url) {
    return 1
  }
  const matches = url?.match(/\/evolution-chain\/(\d+)\//)
  return matches ? Number.parseInt(matches[1]!) : 0
}

// Function to get all Pokemon names from evolution chain
export function getEvolutionNames(chain: EvolutionChain): string[] {
  const names: string[] = []

  function traverse(link: any) {
    names.push(link.species.name)
    if (link.evolves_to && link.evolves_to.length > 0) {
      link.evolves_to.forEach(traverse)
    }
  }

  traverse(chain.chain)
  return names
}

// Enhanced function to get Pokemon with additional data
export async function getEnhancedPokemon(nameOrId: string | number): Promise<EnhancedPokemon> {
  const [pokemon, species] = await Promise.all([getPokemon(nameOrId), getPokemonSpecies(nameOrId)])

  const evolutionChainId = getEvolutionChainIdFromUrl(species?.evolution_chain.url)
  const evolutionChain = await getEvolutionChain(evolutionChainId)
  const evolutionNames = getEvolutionNames(evolutionChain)

  return {
    ...pokemon,
    generation: formatGenerationName(species?.generation?.name),
    evolutionChain: evolutionNames,
  }
}

export async function getPaginatedPokemon(
  offset = 0,
  limit = 20,
): Promise<{
  pokemon: EnhancedPokemon[]
  total: number
  hasMore: boolean
}> {
  // Get the total count first
  const totalResponse = await fetchWithCache<PokemonListResponse>(`${BASE_URL}/pokemon?limit=1&offset=0`)
  const total = totalResponse.count

  // Get the specific page of Pokemon
  const pageResponse = await fetchWithCache<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

  // Fetch detailed data for each Pokemon in this page
  const pokemonWithDetails = await Promise.all(
    pageResponse.results.map(async (item) => {
      const pokemonId = getPokemonIdFromUrl(item.url)
      return getEnhancedPokemon(pokemonId)
    }),
  )

  // Sort by ID
  pokemonWithDetails.sort((a, b) => a.id - b.id)

  return {
    pokemon: pokemonWithDetails,
    total,
    hasMore: offset + limit < total,
  }
}

async function oldFetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url)
  }
  //console.log("cache", cache)
  // 1. chamar fetch with cache dentro do my
  // 2. fazer a logica aqui de adicionar e retirar

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }

  const data = await response.json()
  cache.set(url, data)
  return data
}
