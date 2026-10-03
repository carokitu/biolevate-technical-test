"use client";

import { PokemonRoster } from "./roster";
import { type PokemonCardData } from "../pokemon";
import { formatName } from "./utils";

export function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return text.split(/([^A-Za-z0-9]+)/).map((piece, index) => {
    const matched = terms.some(
      (term) => term.length > 0 && piece.toLowerCase().startsWith(term),
    );

    if (!matched) return piece;

    return (
      <mark key={index} className="rounded-sm bg-gold/40 text-ink">
        {piece}
      </mark>
    );
  });
}

export function InfoCard({
  kind,
  name,
  detail,
  text,
  highlight,
  terms,
  pokemons,
  catalog,
}: {
  kind: string;
  name: string;
  detail?: string;
  text: string;
  highlight: "name" | "type" | "short_effect";
  terms: string[];
  pokemons: string[];
  catalog: Map<string, PokemonCardData>;
}) {
  return (
    <article className="panel">
      <p className="kicker text-muted">{kind}</p>
      <h3
        className={`text-title font-bold text-foreground ${
          highlight === "name" ? "w-fit rounded-sm bg-gold/40 px-inline" : ""
        }`}
      >
        {highlight === "name" ? (
          <Highlighted text={formatName(name)} terms={terms} />
        ) : (
          formatName(name)
        )}
      </h3>
      {detail ? (
        <p
          className={`mt-inline text-copy capitalize ${
            highlight === "type"
              ? "w-fit rounded-sm bg-gold/40 px-inline text-ink"
              : "text-soft"
          }`}
        >
          {detail}
        </p>
      ) : null}
      <p
        className={`mt-stack text-copy text-prose ${
          highlight === "short_effect" ? "w-fit rounded-md bg-gold/25 px-inline" : ""
        }`}
      >
        {highlight === "short_effect" ? <Highlighted text={text} terms={terms} /> : text}
      </p>
      <PokemonRoster names={pokemons} catalog={catalog} />
    </article>
  );
}
