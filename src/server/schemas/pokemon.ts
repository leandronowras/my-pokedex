import { z } from "zod";

/**
 * Zod schema for the PokeAPI Pokemon object
 * https://pokeapi.co/docs/v2#pokemon
 */
export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  base_experience: z.number().nullable(),
  height: z.number(),
  weight: z.number(),
  order: z.number(),
  is_default: z.boolean(),

  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
      is_hidden: z.boolean(),
      slot: z.number(),
    }),
  ),

  forms: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
    }),
  ),

  sprites: z.object({
    front_default: z.string().url().nullable(),
    front_shiny: z.string().url().nullable(),
    front_female: z.string().url().nullable(),
    front_shiny_female: z.string().url().nullable(),
    back_default: z.string().url().nullable(),
    back_shiny: z.string().url().nullable(),
    back_female: z.string().url().nullable(),
    back_shiny_female: z.string().url().nullable(),
    // PokéAPI has many more sprite fields (dream_world, official-artwork, etc.)
  }),

  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
    }),
  ),

  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
    }),
  ),

  species: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
});

export type Pokemon = z.infer<typeof PokemonSchema>;
