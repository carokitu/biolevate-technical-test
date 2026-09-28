import type { Pokedex, Pokemon } from "./types";

export function searchPokemonByName(
  pokedex: Pokedex,
  query: string,
): Pokemon[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return pokedex.pokemon
    .filter((pokemon) => pokemon.name.includes(normalizedQuery))
    .sort((a, b) => {
      const aStartsWith = a.name.startsWith(normalizedQuery);
      const bStartsWith = b.name.startsWith(normalizedQuery);

      if (aStartsWith !== bStartsWith) {
        return aStartsWith ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
}