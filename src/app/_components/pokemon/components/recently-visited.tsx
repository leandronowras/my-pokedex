"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import { Clock, X } from "lucide-react"
import { typeColors } from "~/lib/constants"

interface RecentPokemon {
  id: number
  name: string
  sprite: string
  types: string[]
  visitedAt: number
}

export default function RecentlyVisited() {
  const [recentPokemon, setRecentPokemon] = useState<RecentPokemon[]>([])

  useEffect(() => {
    // Load recent Pokemon from localStorage
    const stored = localStorage.getItem("recentlyVisitedPokemon")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentPokemon(parsed)
      } catch (error) {
        console.error("Failed to parse recently visited Pokemon:", error)
      }
    }
  }, [])

  const clearRecentlyVisited = () => {
    localStorage.removeItem("recentlyVisitedPokemon")
    setRecentPokemon([])
  }

  if (recentPokemon.length === 0) {
    return null
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recently Visited
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyVisited}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {recentPokemon.map((pokemon) => (
            <Link key={`${pokemon.id}-${pokemon.visitedAt}`} href={`/pokemon/${pokemon.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-3">
                  <div className="text-center space-y-2">
                    <div className="relative">
                      <img
                        src={pokemon.sprite || "/placeholder.svg"}
                        alt={pokemon.name}
                        className="w-16 h-16 mx-auto object-contain group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute -top-1 -right-1 bg-muted text-muted-foreground text-xs px-1 py-0.5 rounded text-[10px]">
                        #{pokemon.id.toString().padStart(3, "0")}
                      </div>
                    </div>
                    <h4 className="font-medium text-sm capitalize truncate">{pokemon.name.replace("-", " ")}</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {pokemon.types.slice(0, 2).map((type) => (
                        <Badge
                          key={type}
                          className={`text-white text-[10px] px-1 py-0 ${typeColors[type] || "bg-gray-400 dark:bg-gray-500"}`}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

