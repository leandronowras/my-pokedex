"use client"

import { useEffect } from "react"

import RecentlyVisited from "~/app/_components/pokemon/components/recently-visited"
import { PokemonCard } from "~/app/_components/pokemon/components/pokemon-card"
import { PokemonGrid } from "~/app/_components/pokemon/components/pokemon-grid"
import { LoadingView } from "~/app/_components/pokemon/components/loading-view"
import { ErrorView } from "~/app/_components/pokemon/components/error-view"
import { FiltersCard } from "~/app/_components/pokemon/components/filter-dropdown"
import { PaginationBar } from "~/app/_components/pokemon/components/pagination-bar"

import { usePokemonStore } from "~/app/_store/usePokemonStore"
import { useFilteredPokemon } from "~/app/_hooks/useFilteredPokemon"

export default function PokemonSearch() {
  const {
    // data & ui
    allPokemon,
    types,
    generations,
    loading,
    error,

    // filters & pagination state
    searchTerm,
    selectedType,
    selectedGeneration,
    itemsPerPage,

    // actions
    setSearchTerm,
    setSelectedType,
    setSelectedGeneration,
    setItemsPerPage,
    setCurrentPage, // <-- needed for pagination
    clearFilters,
    fetchPokemonData,
    fetchNewPokemonData,
    setLastPage
  } = usePokemonStore()

  const {
    filteredPokemon,
    filteredCount,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
  } = useFilteredPokemon()

  useEffect(() => {
    fetchPokemonData()
  }, []),

    useEffect(() => {
      //console.log("allPokemon", allPokemon)
      if (currentPage > 3) {
        const newData = async () => {
          await fetchNewPokemonData(currentPage, startIndex, endIndex)
        }
        newData()
      }
    }, [currentPage])


  const hasActiveFilters =
    !!searchTerm || selectedType !== "all" || selectedGeneration !== "all"

  if (loading) return <LoadingView />
  if (error) return <ErrorView message={error} />

  return (
    <div className="space-y-6">
      <FiltersCard
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedGeneration={selectedGeneration}
        setSelectedGeneration={setSelectedGeneration}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        types={types}
        generations={generations}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        startIndex={startIndex}
        endIndex={endIndex}
        filteredCount={filteredCount}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <RecentlyVisited />

      <PokemonGrid
        filteredPokemon={filteredPokemon}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        PokemonCardComponent={PokemonCard}
      />

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        mySetCurrentPage={setLastPage}
        onChange={(p) => {
          const page = Math.min(Math.max(1, p), totalPages)
          setCurrentPage(page)
        }}
      />
    </div>
  )
}

