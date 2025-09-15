"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/app/_components/ui/select";
import { Button } from "~/app/_components/ui/button";
import { Search, Filter, X } from "lucide-react";
import type { Type, Generation } from "src/lib/types";
import { formatGenerationName } from "~/lib/pokemon-api";

type FiltersCardProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedGeneration: string;
  setSelectedGeneration: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  types: Type[];
  generations: Generation[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  startIndex: number;
  endIndex: number;
  filteredCount: number;
  totalPages: number;
  currentPage: number;
};

export function FiltersCard({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedGeneration,
  setSelectedGeneration,
  itemsPerPage,
  setItemsPerPage,
  types,
  generations,
  hasActiveFilters,
  clearFilters,
  startIndex,
  endIndex,
  filteredCount,
  totalPages,
  currentPage,
}: FiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Find your Pokémon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Pokémon (includes evolutions)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Dropdown filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name?.charAt(0).toUpperCase() + type.name?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Generation */}
          <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Generation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Generations</SelectItem>
              {generations.map((gen) => (
                <SelectItem key={gen.id} value={formatGenerationName(gen.name)}>
                  {formatGenerationName(gen.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Items per page */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="36">36 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 bg-transparent"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCount)} of
            {hasActiveFilters ? ` ${filteredCount}` : " 1025"} Pokémon
            {hasActiveFilters && (
              <span className="ml-2 text-primary">(filtered)</span>
            )}
          </div>
          {totalPages > 1 && (
            <div>
              Page {currentPage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

