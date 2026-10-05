"use client";

import { useEffect, useState } from "react";

import type { PokemonCardData } from "../cards/pokemon";
import type { SearchResults } from "@/search/search";
import type { PokemonSort } from "@/search/sort";

import { Failure } from "../failure";
import { SearchResultsView } from "./search-results";
import { Empty } from "../empty";

function sortGoesBesidePokemon(results: SearchResults) {
  return (
    results.pokemon.length > 1 &&
    (results.moves.length > 0 || results.abilities.length > 0)
  );
}

export function Query({
  query,
  catalog,
  sort,
  onSort,
  onSortPlacement,
}: {
  query: string;
  catalog: Map<string, PokemonCardData>;
  sort: PokemonSort;
  onSort: (sort: PokemonSort) => void;
  onSortPlacement: (besidePokemon: boolean) => void;
}) {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as
          | { query: string; results: SearchResults }
          | { error: string };

        if (!response.ok || !("results" in body)) {
          throw new Error(
            "error" in body ? body.error : "Unable to search the Pokédex.",
          );
        }

        if (controller.signal.aborted) return;
        setResults(body.results);
        onSortPlacement(sortGoesBesidePokemon(body.results));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        onSortPlacement(false);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to search the Pokédex.",
        );
      });

    return () => controller.abort();
  }, [query, onSortPlacement]);

  if (errorMessage) return <Failure />;
  if (!results) return <p className="text-copy">Searching…</p>;

  const isEmpty =
    results.pokemon.length === 0 &&
    results.moves.length === 0 &&
    results.abilities.length === 0;

  if (isEmpty) return <Empty query={query} />;

  return (
    <SearchResultsView
      query={query}
      results={results}
      catalog={catalog}
      sort={sort}
      onSort={onSort}
      sortBesidePokemon={sortGoesBesidePokemon(results)}
    />
  );
}
