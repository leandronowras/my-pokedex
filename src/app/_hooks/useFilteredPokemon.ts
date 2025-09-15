"use client";

import { useMemo } from "react";
import { usePokemonStore } from "../_store/usePokemonStore";
import type { Pokemon } from "src/lib/types";

interface PokemonWithDetails extends Pokemon {
  generation: string;
  evolutionChain: string[];
}

export function useFilteredPokemon() {
  const {
    allPokemon,
    searchTerm,
    selectedType,
    selectedGeneration,
    itemsPerPage,
    currentPage,
    setCurrentPage,
  } = usePokemonStore();

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      console.log(pokemon.generation)
      if (pokemon.generation == "Gen undefined") return false
      if (pokemon.id > 10000) return false
      // Type filter
      if (selectedType !== "all") {
        console.log("types", pokemon.types)
        const hasType = pokemon.types.some(
          (t: any) => t === selectedType
        );
        if (!hasType) return false;
      }

      // Generation filter
      if (selectedGeneration !== "all") {
        if (pokemon.generation !== selectedGeneration) return false;
      }

      // Search filter (includes evolutions)
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const nameMatch = pokemon.name.toLowerCase().includes(q);
        const evoMatch = pokemon.evolutionChain.some((evo) =>
          evo.toLowerCase().includes(q)
        );
        if (!nameMatch && !evoMatch) return false;
      }

      return true;
    });
  }, [allPokemon, searchTerm, selectedType, selectedGeneration]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // clamp page automatically
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex);

  return {
    filteredPokemon: paginatedPokemon,
    totalPages,
    currentPage: safePage,
    startIndex,
    endIndex,
    filteredCount: filteredPokemon.length,
  };
}

