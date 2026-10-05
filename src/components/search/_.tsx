"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { PokemonSort } from "@/search/sort";

import { CardGrid, type PokemonCardData } from "../cards";
import { Query } from "./query";
import { Form } from "./form";
import { Section, SortControl } from "./shared";
import { orderCards } from "./utils";

const SEARCH_DELAY_MS = 300;

export function Search({ catalog }: { catalog: PokemonCardData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() ?? "";

  const [draft, setDraft] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [sort, setSort] = useState<PokemonSort>({ key: "relevance", direction: "desc" });
  const [sortBesidePokemon, setSortBesidePokemon] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);


  function publish(value: string) {
    const next = value.trim();
    setQuery(next);
    setSortBesidePokemon(false);
    router.replace(next ? `/?q=${encodeURIComponent(next)}` : "/", { scroll: false });
  }

  function change(value: string) {
    setDraft(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => publish(value), SEARCH_DELAY_MS);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const catalogByName = new Map(catalog.map((pokemon) => [pokemon.name, pokemon]));

  return (
    <div className="flex flex-col gap-page">
      <div className="flex flex-col items-center gap-section">
        <Form
          value={draft}
          onChange={change}
          onSubmit={() => {
            if (timer.current) clearTimeout(timer.current);
            publish(draft);
          }}
        />
        {sortBesidePokemon ? null : <SortControl sort={sort} onChange={setSort} />}
      </div>
      <div aria-live="polite">
        {query ? (
          <Query
            key={query}
            query={query}
            catalog={catalogByName}
            sort={sort}
            onSort={setSort}
            onSortPlacement={setSortBesidePokemon}
          />
        ) : (
          <Section title="All Pokémon" count={catalog.length}>
            <CardGrid cards={orderCards(catalog.map((pokemon) => ({ pokemon })), sort)} />
          </Section>
        )}
      </div>
    </div>
  );
}
