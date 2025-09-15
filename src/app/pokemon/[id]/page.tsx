"use client"

import * as React from "react";

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowBigUp } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { Badge } from "~/app/_components/ui/badge"
import { Progress } from "~/app/_components/ui/progress"
import { getEnhancedPokemon, getPokemon } from "~/lib/pokemon-api"
import { addToRecentlyVisited } from "~/lib/recently-visited"


export default function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pokemon, setPokemon] = useState<any>(null)
  const [validEvolutions, setValidEvolutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const pokemonData = await getEnhancedPokemon(id)
        setPokemon(pokemonData)

        addToRecentlyVisited({
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
          types: pokemonData.types.map((t: any) => t.type.name),
        })

        // Get evolution chain Pokemon data
        const evolutionPokemon = await Promise.all(
          pokemonData.evolutionChain?.map(async (name: string) => {
            try {
              return await getPokemon(name)
            } catch {
              return null
            }
          }) || [],
        )

        setValidEvolutions(evolutionPokemon.filter(Boolean))
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !pokemon) {
    notFound()
  }

  const typeColors: Record<string, string> = {
    normal: "bg-gray-400 dark:bg-gray-500",
    fire: "bg-red-500 dark:bg-red-600",
    water: "bg-blue-500 dark:bg-blue-600",
    electric: "bg-yellow-400 dark:bg-yellow-500",
    grass: "bg-green-500 dark:bg-green-600",
    ice: "bg-blue-200 dark:bg-blue-300",
    fighting: "bg-red-700 dark:bg-red-800",
    poison: "bg-purple-500 dark:bg-purple-600",
    ground: "bg-yellow-600 dark:bg-yellow-700",
    flying: "bg-indigo-400 dark:bg-indigo-500",
    psychic: "bg-pink-500 dark:bg-pink-600",
    bug: "bg-green-400 dark:bg-green-500",
    rock: "bg-yellow-800 dark:bg-yellow-900",
    ghost: "bg-purple-700 dark:bg-purple-800",
    dragon: "bg-indigo-700 dark:bg-indigo-800",
    dark: "bg-gray-800 dark:bg-gray-900",
    steel: "bg-gray-500 dark:bg-gray-600",
    fairy: "bg-pink-300 dark:bg-pink-400",
  }

  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Pokédex
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Main Info */}
          <div className="space-y-6">
            {/* Pokemon Header */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <img
                      src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-48 h-48 mx-auto object-contain"
                    />
                    <div className="absolute top-0 right-0 bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold capitalize text-foreground mb-2">
                      {pokemon.name.replace("-", " ")}
                    </h1>
                    <Badge variant="outline" className="text-sm">
                      {pokemon.generation}
                    </Badge>
                  </div>

                  {/* Types */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pokemon.types.map((type: any) => (
                      <Badge
                        key={type.type.name}
                        className={`text-white ${typeColors[type.type.name] || "bg-gray-400 dark:bg-gray-500"}`}
                      >
                        {type.type.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{pokemon.height / 10}m</p>
                      <p className="text-sm text-muted-foreground">Height</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{pokemon.weight / 10}kg</p>
                      <p className="text-sm text-muted-foreground">Weight</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pokemon.stats.map((stat: any) => (
                  <div key={stat.stat.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{statNames[stat.stat.name] || stat.stat.name}</span>
                      <span className="text-sm font-bold">{stat.base_stat}</span>
                    </div>
                    <Progress value={(stat.base_stat / 255) * 100} className="h-2" />
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">
                      {pokemon.stats.reduce((total: any, stat: any) => total + stat.base_stat, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Evolution Chain */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolution Chain</CardTitle>
              </CardHeader>
              <CardContent>
                {validEvolutions.length > 1 ? (
                  <div className="space-y-4">
                    {validEvolutions.map((evolution, index) => (
                      <div key={evolution.id} className="flex items-center space-x-4">
                        {/* Evolution Arrow */}
                        {index == 1 && (
                          <div className="flex-shrink-0 text-muted-foreground">
                            <ArrowBigUp className="h-4 w-4" />
                          </div>
                        )}
                        {index == 2 && (
                          <div className="flex-shrink-0 text-muted-foreground flex">
                            <ArrowBigUp className="h-4 w-4" />
                            <ArrowBigUp className="h-4 w-4" />
                          </div>
                        )}
                        {index == 3 && (
                          <div className="flex-shrink-0 text-muted-foreground flex">
                            <ArrowBigUp className="h-4 w-4" />
                            <ArrowBigUp className="h-4 w-4" />
                            <ArrowBigUp className="h-4 w-4" />
                          </div>
                        )}

                        {/* Evolution Card */}
                        <Link
                          href={`/pokemon/${evolution.id}`}
                          className={`flex-1`}
                        >
                          <Card
                            className={`hover:shadow-md transition-shadow cursor-pointer ${evolution.id === pokemon.id ? "bg-primary/5 border-primary" : ""
                              }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={
                                    evolution.sprites.other["official-artwork"].front_default ||
                                    evolution.sprites.front_default ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={evolution.name}
                                  className="w-16 h-16 object-contain"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold capitalize">
                                    {evolution.name.replace("-", " ")}
                                    {evolution.id === pokemon.id && (
                                      <Badge variant="default" className="ml-2 text-xs">
                                        Current
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    #{evolution.id.toString().padStart(3, "0")}
                                  </p>
                                  <div className="flex gap-1 mt-1">
                                    {evolution.types.map((type: any) => (
                                      <Badge
                                        key={type.type.name}
                                        className={`text-white text-xs ${typeColors[type.type.name] || "bg-gray-400 dark:bg-gray-500"}`}
                                      >
                                        {type.type.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">This Pokémon does not evolve.</p>
                )}
              </CardContent>
            </Card>

            {/* Additional Sprites */}
            <Card>
              <CardHeader>
                <CardTitle>Sprites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {pokemon.sprites.front_default && (
                    <div className="text-center">
                      <img
                        src={pokemon.sprites.front_default || "/placeholder.svg"}
                        alt={`${pokemon.name} front`}
                        className="w-24 h-24 mx-auto object-contain bg-muted rounded"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Front</p>
                    </div>
                  )}
                  {pokemon.sprites.back_default && (
                    <div className="text-center">
                      <img
                        src={pokemon.sprites.back_default || "/placeholder.svg"}
                        alt={`${pokemon.name} back`}
                        className="w-24 h-24 mx-auto object-contain bg-muted rounded"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Back</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

