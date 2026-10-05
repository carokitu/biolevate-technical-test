import { extractSearchTerms } from "./query";
import type { Pokedex, Pokemon, Move, Ability } from "@/pokedex/types";

type FieldKind = "id" | "name" | "type" | "genus" | "short_effect";

type Field = {
  kind: FieldKind;
  text: string;
};

export type MatchSource = { kind: FieldKind; text: string };

export type SearchHit<T> = {
  item: T;
  exact: boolean;
  source: MatchSource;
};

const FIELD_PRIORITY: Record<FieldKind, number> = {
  id: 5,
  name: 4,
  type: 3,
  genus: 2,
  short_effect: 1,
};

/** Exact id ranks above a padded number that merely contains the digits, like 2 inside 012. */
function scoreField(field: Field, term: string): number {
  if (field.kind === "id") {
    if (!/^\d+$/.test(term)) return 0;

    const padded = field.text.padStart(3, "0");
    if (Number(term) === Number(field.text)) return 3;
    if (padded.includes(term)) return 1;

    return 0;
  }

  return getTextMatchScore(field.text, term);
}

/** 3 when the field equals the word, 2 when the field starts with it, 1 when one of its words does. */
function getTextMatchScore(text: string, query: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const words = normalizedText.split(/[^a-z0-9]+/).filter(Boolean);

  if (normalizedText === normalizedQuery) return 3;
  if (normalizedText.startsWith(normalizedQuery)) return 2;
  if (words.some((word) => word.startsWith(normalizedQuery))) return 1;

  return 0;
}

/** A word of the field equals the term, like "sleep" inside "sleep-powder". */
function hasExactWord(text: string, term: string): boolean {
  const normalized = text.toLowerCase();
  if (normalized === term) return true;

  return normalized
    .split(/[^a-z0-9]+/)
    .some((word) => word === term);
}

/**
 * Several exact words outrank one strong hit.
 * "sleep powder" then prefers Sleep Powder over a move that only equals "powder".
 */
function multiExactBonus(exactTermCount: number): number {
  if (exactTermCount < 2) return 0;

  return exactTermCount * 3;
}

function rankFields(
  fields: Field[],
  terms: string[],
): { score: number; exact: boolean; source: MatchSource } | null {
  let total = 0;
  let exactTerms = 0;
  let best: { score: number; field: Field } | null = null;

  for (const term of terms) {
    let bestForTerm = 0;
    let exactForTerm = false;

    for (const field of fields) {
      const score = scoreField(field, term);
      if (score > bestForTerm) bestForTerm = score;
      if (score === 0) continue;
      if (field.kind !== "id" && hasExactWord(field.text, term)) exactForTerm = true;

      const closer =
        !best ||
        score > best.score ||
        (score === best.score &&
          FIELD_PRIORITY[field.kind] > FIELD_PRIORITY[best.field.kind]);

      if (closer) best = { score, field };
    }

    total += bestForTerm;
    if (exactForTerm) exactTerms += 1;
  }

  if (!best || total === 0) return null;

  return {
    score: total + multiExactBonus(exactTerms),
    exact: best.score === 3,
    source: { kind: best.field.kind, text: best.field.text },
  };
}

function searchHits<T>(
  items: T[],
  query: string,
  getFields: (item: T) => Field[],
): (SearchHit<T> & { score: number })[] {
  const terms = extractSearchTerms(query);

  if (terms.length === 0) return [];

  return items
    .map((item) => {
      const ranked = rankFields(getFields(item), terms);
      if (!ranked) return null;

      return { item, ...ranked };
    })
    .filter((hit) => hit !== null)
    .sort((a, b) => b.score - a.score);
}

function pokemonFields(pokemon: Pokemon): Field[] {
  return [
    { kind: "id", text: String(pokemon.id) },
    { kind: "name", text: pokemon.name },
    ...pokemon.types.map((text) => ({ kind: "type" as const, text })),
    { kind: "genus", text: pokemon.species.genus },
  ];
}

function moveFields(move: Move): Field[] {
  return [
    { kind: "name", text: move.name },
    { kind: "type", text: move.type },
    { kind: "short_effect", text: move.short_effect },
  ];
}

function abilityFields(ability: Ability): Field[] {
  return [
    { kind: "name", text: ability.name },
    { kind: "short_effect", text: ability.short_effect },
  ];
}

export type SearchSection = "pokemon" | "moves" | "abilities";

const SECTION_RANK: Record<SearchSection, number> = {
  pokemon: 0,
  moves: 1,
  abilities: 2,
};

function bestNameScore(names: string[], terms: string[]): number {
  return names.reduce((best, name) => {
    let exactTerms = 0;
    const score = terms.reduce((total, term) => {
      const termScore = getTextMatchScore(name, term);
      if (termScore > 0 && hasExactWord(name, term)) exactTerms += 1;

      return total + termScore;
    }, 0);

    return Math.max(best, score + multiExactBonus(exactTerms));
  }, 0);
}

/** Highest name match first. A tie keeps Pokémon, then moves, then abilities. */
function orderSections(scores: Record<SearchSection, number>): SearchSection[] {
  return (Object.keys(SECTION_RANK) as SearchSection[]).sort(
    (a, b) => scores[b] - scores[a] || SECTION_RANK[a] - SECTION_RANK[b],
  );
}

export type SearchResults = {
  pokemon: SearchHit<Pokemon>[];
  moves: SearchHit<Move>[];
  abilities: SearchHit<Ability>[];
  order: SearchSection[];
};

function withoutScore<T>(hit: SearchHit<T> & { score: number }): SearchHit<T> {
  return { item: hit.item, exact: hit.exact, source: hit.source };
}

/** Pokémon, moves, and abilities that match, with sections ordered by the closest name. */
export function search(pokedex: Pokedex, query: string): SearchResults {
  const terms = extractSearchTerms(query);
  
  const moves = searchHits(pokedex.moves, query, moveFields);
  const abilities = searchHits(pokedex.abilities, query, abilityFields);
  const pokemon = searchHits(pokedex.pokemon, query, pokemonFields);

  const order = orderSections({
    pokemon: bestNameScore(
      pokemon.map((hit) => hit.item.name),
      terms,
    ),
    moves: bestNameScore(
      moves.map((hit) => hit.item.name),
      terms,
    ),
    abilities: bestNameScore(
      abilities.map((hit) => hit.item.name),
      terms,
    ),
  });

  return {
    pokemon: pokemon.map(withoutScore),
    moves: moves.map(withoutScore),
    abilities: abilities.map(withoutScore),
    order,
  };
}