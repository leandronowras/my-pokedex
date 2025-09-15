import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PokemonSchema } from "~/server/schemas/pokemon";
import { TRPCError } from "@trpc/server";

const BASE_URL = "https://pokeapi.co/api/v2"

export const pokeApiRouter = createTRPCRouter({
  myAllPages: publicProcedure.query((({ }) => {
    return Math.ceil(1302 / 10)
  })),
  myAllPokemons: publicProcedure.query(async () => {
    const res = await fetch(`${BASE_URL}/pokemon?limit=1`, { cache: "no-store" });
    if (!res.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to fetch: ${res.statusText}`,
      });
    }
    const data: any = await res.json();

    return data.count;
  }),
  myDynamicFetch: publicProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        itemsPerPageInit: z.number().int().min(0),
        itemsPerPageEnd: z.number().int().min(1).max(10000),
      })
    )
    .query(async ({ input }) => {
      const { currentPage, itemsPerPageInit, itemsPerPageEnd } = input;

      const limit = itemsPerPageEnd - itemsPerPageInit;
      if (limit <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "itemsPerPageEnd must be greater than itemsPerPageInit",
        });
      }
      const offset = (currentPage - 1) * limit;

      const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

      try {
        const data = await fetchWithCache<any>(url);
        return data;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            err instanceof Error ? `Failed to fetch: ${err.message}` : "Failed to fetch",
        });
      }
    }),
});

// cache stuff
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
