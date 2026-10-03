"use client";

import type { PokemonCardData } from "./pokemon";
import { fieldHighlight, InfoCard } from "./shared";
import type { SearchHit } from "@/search/search";
import type { Move } from "@/pokedex/types";

export function MoveCard({
  hit,
  terms,
  catalog,
}: {
  hit: SearchHit<Move>;
  terms: string[];
  catalog: Map<string, PokemonCardData>;
}) {
  return (
    <InfoCard
      kind="Move"
      name={hit.item.name}
      detail={hit.item.type}
      text={hit.item.short_effect}
      highlight={fieldHighlight(hit.source)}
      terms={terms}
      pokemons={hit.item.learned_by_pokemon}
      catalog={catalog}
    />
  );
}
