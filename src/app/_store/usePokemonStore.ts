import { create } from "zustand";
import type { PokemonListItem, Type, Generation } from "src/lib/types";
import {
  getAllPokemon,
  getNewAllPokemon,
  getPokemon,
  getPokemonSpecies,
  getPokemonIdFromUrl,
  formatGenerationName,
  getAllTypes,
  getAllGenerations,
  getEvolutionChain,
  getEvolutionChainIdFromUrl,
  getEvolutionNames,
} from "~/lib/pokemon-api";

type PokemonWithDetails = {
  id: number;
  name: string;
  sprites: any;
  types: string[];
  generation: string;
  evolutionChain: string[];
};

type PokemonStore = {
  pokemonCache: Map<number, PokemonWithDetails>;
  allPokemon: PokemonWithDetails[];
  types: Type[];
  generations: Generation[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedType: string;
  selectedGeneration: string;
  itemsPerPage: number;
  currentPage: number;

  setSearchTerm: (v: string) => void;
  setSelectedType: (v: string) => void;
  setSelectedGeneration: (v: string) => void;
  setItemsPerPage: (n: number) => void;
  setCurrentPage: (n: number) => void;
  setLastPage: () => void;
  clearFilters: () => void;

  fetchPokemonData: () => Promise<void>;
  fetchNewPokemonData: (currentPage: number, limit: number, offset: number) => Promise<void>;
};

const MAX_CACHE = 1025;
const TRIM_COUNT = 50;

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemonCache: new Map(),
  allPokemon: [],
  types: [],
  generations: [],
  loading: true,
  error: null,
  searchTerm: "",
  selectedType: "all",
  selectedGeneration: "all",
  itemsPerPage: 12,
  currentPage: 1,

  setSearchTerm: (v) => set({ searchTerm: v, currentPage: 1 }),
  setSelectedType: (v) => set({ selectedType: v, currentPage: 1 }),
  setSelectedGeneration: (v) => set({ selectedGeneration: v, currentPage: 1 }),
  setItemsPerPage: (n) => set({ itemsPerPage: n, currentPage: 1 }),
  setCurrentPage: (n) => set({ currentPage: n }),
  setLastPage: () => {
    const total = get().allPokemon.length;
    const perPage = get().itemsPerPage;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    set({ currentPage: lastPage });
  },
  clearFilters: () =>
    set({
      searchTerm: "",
      selectedType: "all",
      selectedGeneration: "all",
      currentPage: 1,
    }),

  fetchPokemonData: async () => {
    try {
      set({ loading: true, error: null });

      const [pokemonList, typesData, generationsData] = await Promise.all([
        getAllPokemon(200),
        getAllTypes(),
        getAllGenerations(),
      ]);

      const details = await Promise.all(
        pokemonList.results.map(async (item: PokemonListItem) => {
          const pokemonId = getPokemonIdFromUrl(item.url);
          const [pokemonData, speciesData] = await Promise.all([
            getPokemon(pokemonId),
            getPokemonSpecies(pokemonId),
          ]);
          const evolutionChainId = getEvolutionChainIdFromUrl(
            speciesData?.evolution_chain.url
          );
          const evolutionChain = await getEvolutionChain(evolutionChainId);
          const evolutionNames = getEvolutionNames(evolutionChain);

          return {
            ...pokemonData,
            types: pokemonData.types.map((t: any) => t.type.name),
            generation: formatGenerationName(speciesData?.generation?.name),
            evolutionChain: evolutionNames,
          } as PokemonWithDetails;
        })
      );

      const cache = new Map<number, PokemonWithDetails>();
      details.forEach((p) => cache.set(p.id, p));

      set({
        pokemonCache: cache,
        allPokemon: Array.from(cache.values()).sort((a, b) => a.id - b.id),
        types: typesData,
        generations: generationsData,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch Pokemon data",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchNewPokemonData: async (currentPage, limit, offset) => {
    try {
      set({ loading: true, error: null });

      const [pokemonList, typesData, generationsData] = await Promise.all([
        getNewAllPokemon(currentPage, limit, offset),
        getAllTypes(),
        getAllGenerations(),
      ]);

      const newBatch = await Promise.all(
        pokemonList.results.map(async (item: PokemonListItem) => {
          const pokemonId = getPokemonIdFromUrl(item.url);
          const [pokemonData, speciesData] = await Promise.all([
            getPokemon(pokemonId),
            getPokemonSpecies(pokemonId),
          ]);
          const evolutionChainId = getEvolutionChainIdFromUrl(
            speciesData?.evolution_chain.url
          );
          const evolutionChain = await getEvolutionChain(evolutionChainId);
          const evolutionNames = getEvolutionNames(evolutionChain);

          return {
            ...pokemonData,
            types: pokemonData.types.map((t: any) => t.type.name),
            generation: formatGenerationName(speciesData?.generation?.name),
            evolutionChain: evolutionNames,
          } as PokemonWithDetails;
        })
      );

      const cache = new Map(get().pokemonCache);
      newBatch.forEach((p) => cache.set(p.id, p));

      if (cache.size > MAX_CACHE) {
        const keys = Array.from(cache.keys()).sort((a, b) => a - b);
        for (let i = 0; i < TRIM_COUNT; i++) {
          cache.delete(keys[i]!);
        }
      }

      set({
        pokemonCache: cache,
        allPokemon: Array.from(cache.values()).sort((a, b) => a.id - b.id),
        types: typesData,
        generations: generationsData,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch Pokemon data",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

