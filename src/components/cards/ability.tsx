"use client";

import type { PokemonCardData } from "./pokemon";
import { fieldHighlight, InfoCard } from "./shared";
import type { SearchHit } from "@/search/search";
import type { Ability } from "@/pokedex/types";

export function AbilityCard({
  hit,
  terms,
  catalog,
}: {
  hit: SearchHit<Ability>;
  terms: string[];
  catalog: Map<string, PokemonCardData>;
}) {
  return (
    <InfoCard
      kind="Ability"
      name={hit.item.name}
      text={hit.item.short_effect}
      highlight={fieldHighlight(hit.source)}
      terms={terms}
      pokemons={hit.item.pokemon}
      catalog={catalog}
    />
  );
}
