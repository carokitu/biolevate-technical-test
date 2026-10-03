import type { Pokemon } from "@/pokedex/types";

export type StatSortKey = keyof Pokemon["stats"];
export type PokemonSortKey = "relevance" | "id" | StatSortKey;

export type PokemonSort = {
  key: PokemonSortKey;
  direction: "asc" | "desc";
};

type Sortable = {
  id: number;
  stats: Pokemon["stats"];
};

/** Orders by the chosen stat, or by Pokédex number. Equal values stay in number order. */
export function sortPokemon<T>(
  items: T[],
  key: Exclude<PokemonSortKey, "relevance">,
  direction: "asc" | "desc",
  read: (item: T) => Sortable,
): T[] {
  const sign = direction === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    const left = read(a);
    const right = read(b);
    const diff = key === "id" ? left.id - right.id : left.stats[key] - right.stats[key];

    return sign * diff || left.id - right.id;
  });
}
