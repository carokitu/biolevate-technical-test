import { Fragment } from "react";

import { type PokemonCardData, AbilityCard, CardGrid, MoveCard, pokemonCards } from "../cards";
import { extractSearchTerms } from "@/search/query";
import type { SearchResults } from "@/search/search";
import type { PokemonSort } from "@/search/sort";
import { ResultList, Section } from "./shared";
import { SortControl } from "./shared";
import { orderCards } from "./utils";

export function SearchResultsView({
  query,
  results,
  catalog,
  sort,
  onSort,
  sortBesidePokemon,
}: {
  query: string;
  results: SearchResults;
  catalog: Map<string, PokemonCardData>;
  sort: PokemonSort;
  onSort: (sort: PokemonSort) => void;
  sortBesidePokemon: boolean;
}) {
  const terms = extractSearchTerms(query);
  const pokemonCardsInOrder = orderCards(pokemonCards(results.pokemon), sort);

  const pokemon =
    pokemonCardsInOrder.length > 0 ? (
      <Section
        title="Pokémon"
        count={pokemonCardsInOrder.length}
        action={
          sortBesidePokemon ? <SortControl sort={sort} onChange={onSort} /> : null
        }
      >
        <CardGrid cards={pokemonCardsInOrder} />
      </Section>
    ) : null;

  const moves =
    results.moves.length > 0 ? (
      <Section title="Moves" count={results.moves.length}>
        <ResultList>
          {results.moves.map((hit) => (
            <li key={hit.item.id}>
              <MoveCard hit={hit} terms={terms} catalog={catalog} />
            </li>
          ))}
        </ResultList>
      </Section>
    ) : null;

  const abilities =
    results.abilities.length > 0 ? (
      <Section title="Abilities" count={results.abilities.length}>
        <ResultList>
          {results.abilities.map((hit) => (
            <li key={hit.item.id}>
              <AbilityCard hit={hit} terms={terms} catalog={catalog} />
            </li>
          ))}
        </ResultList>
      </Section>
    ) : null;

  const sections = { pokemon, moves, abilities };

  return (
    <div className="flex flex-col gap-page">
      {results.order.map((section) => (
        <Fragment key={section}>{sections[section]}</Fragment>
      ))}
    </div>
  );
}
