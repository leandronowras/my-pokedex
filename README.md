# Pokédex
> Explore Pokémon with real-time search, filters, and detailed stats powered by PokéAPI.
[![Build Status](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)](https://github.com/user/repo/actions)
[![npm version](https://img.shields.io/npm/v/package-name)](https://www.npmjs.com/package/package-name)
[![License](https://img.shields.io/github/license/user/repo)](LICENSE)

A responsive Pokédex built with Next.js, TypeScript, and shadcn/ui. The app streams data from PokéAPI to deliver instant search, filter, and browsing experiences, making it easy for fans to find their favorite Pokémon and dig into evolutions or stats without friction.

## Table of Contents
- [Key Features](#key-features)
- [Screenshots or Demo](#screenshots-or-demo)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Configuration](#configuration)

## Key Features
- Interactive Pokémon catalog with type, generation, and pagination controls.
- Real-time search that includes evolution families in the results.
- Persistent state so filters and pagination survive navigation.
- Detail pages with official artwork, stats, evolutions, and sprites.
- Optimized caching strategy to minimize redundant PokéAPI calls.

## Screenshots or Demo
- Live demo: [https://my-pokedex-production.up.railway.app/](https://my-pokedex-production.up.railway.app/)

## Quick Start
Get up and running in less than 5 minutes:
```bash
npm install
npm run dev
```
Visit http://localhost:3000 to see the application.

## Installation
### Prerequisites
- Node.js 18+
- npm 10+

### Install from npm
Install dependencies for local development:
```bash
npm install
```

### Install from source
```bash
git clone https://github.com/user/repo.git
cd repo
npm install
npm run build
```

## Usage Examples
### Basic Example
Use the store helpers to render a compact Pokémon list in any client component:
```tsx
"use client";

import { useEffect } from "react";
import { usePokemonStore } from "~/app/_store/usePokemonStore";

export function StarterList() {
  const { allPokemon, fetchPokemonData } = usePokemonStore();

  useEffect(() => {
    void fetchPokemonData();
  }, [fetchPokemonData]);

  return (
    <ul>
      {allPokemon.slice(0, 5).map((pokemon) => (
        <li key={pokemon.id}>{pokemon.name}</li>
      ))}
    </ul>
  );
}
```

### Advanced Example
Fetch a specific page of results on the server with tRPC and pass it to your UI:
```ts
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export async function getPokemonPage() {
  const context = await createTRPCContext({
    headers: new Headers({ "x-trpc-source": "docs-example" }),
  });
  const caller = createCaller(context);

  const response = await caller.poke_api.myDynamicFetch({
    currentPage: 2,
    itemsPerPageInit: 0,
    itemsPerPageEnd: 20,
  });

  return response.results;
}
```

## API Reference
- Browse interactive documentation: [docs/how-to-browse-pokemon.mdx](docs/how-to-browse-pokemon.mdx)
- The `poke_api` router exposes:
  - `myAllPages`: returns the total number of pages.
  - `myAllPokemons`: returns the total Pokémon count.
  - `myDynamicFetch`: paginated list query that accepts `{ currentPage, itemsPerPageInit, itemsPerPageEnd }`.

## Configuration
| Setting | Location | Description |
| --- | --- | --- |
| PokéAPI base URL | `src/server/api/routers/pokeApi.ts` | Change to point at a different Pokémon data source. |
| Items per page defaults | `src/app/_store/usePokemonStore.ts` | Update `itemsPerPage` to adjust list density. |
| Recently visited cache size | `src/lib/recently-visited.ts` | Adjust retention for the sidebar history. |
