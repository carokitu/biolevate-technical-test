import type { Pokedex, Pokemon, Move, Ability } from "./types";

function getTextMatchScore(text: string, query: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedText === normalizedQuery) return 3;
  if (normalizedText.startsWith(normalizedQuery)) return 2;
  if (normalizedText.includes(normalizedQuery)) return 1;

  return 0;
}

function searchItems<T>(
  items: T[],
  query: string,
  getSearchableFields: (item: T) => string[],
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  return items
    .map((item) => {
      const score = Math.max(
        ...getSearchableFields(item).map((field) =>
          getTextMatchScore(field, normalizedQuery),
        ),
      );

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

export function searchPokemonByName(
  pokedex: Pokedex,
  query: string,
): Pokemon[] {
  return searchItems(pokedex.pokemon, query, (pokemon) => [
    pokemon.name,
  ]);
}

export function searchMoves(
  pokedex: Pokedex,
  query: string,
): Move[] {
  return searchItems(pokedex.moves, query, (move) => [
    move.name,
    move.type,
    move.short_effect,
    move.effect,
  ]);
}

export function searchAbilities(
  pokedex: Pokedex,
  query: string,
): Ability[] {
  return searchItems(pokedex.abilities, query, (ability) => [
    ability.name,
    ability.short_effect,
    ability.effect,
  ]);
}

export function getPokemonForMove(
  pokedex: Pokedex,
  move: Move,
): Pokemon[] {
  return pokedex.pokemon.filter((pokemon) =>
    move.learned_by_pokemon.includes(pokemon.name),
  );
}

export type SearchResults = {
  pokemon: Pokemon[];
  moves: Move[];
  abilities: Ability[];
};

export function search(
  pokedex: Pokedex,
  query: string,
): SearchResults {
  return {
    pokemon: searchPokemonByName(pokedex, query),
    moves: searchMoves(pokedex, query),
    abilities: searchAbilities(pokedex, query),
  };
}