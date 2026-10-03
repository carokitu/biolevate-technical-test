import type { ReactNode } from "react";

import type { Pokemon } from "@/pokedex/types";

import { CardArtwork } from "./artwork";
import { PokemonCardData, PokemonCardHighlight } from "./types";
import { formatName } from "../shared";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const DARK_TEXT_TYPES = new Set([
  "electric",
  "ice",
  "ground",
]);

const STAT_LABELS: Record<keyof Pokemon["stats"], string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

const STAT_ENTRIES = Object.entries(STAT_LABELS) as [keyof Pokemon["stats"], string][];

function CardFrame({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <article className="card-shell" style={{ backgroundColor: color }}>
      <div className="card-face">{children}</div>
    </article>
  );
}

function Mark({ children }: { children: ReactNode }) {
  return <mark className="rounded-sm bg-gold/40 text-ink">{children}</mark>;
}

function CardHeader({
  pokemon,
  highlight,
}: {
  pokemon: PokemonCardData;
  highlight?: PokemonCardHighlight;
}) {
  return (
    <header className="flex items-start justify-between gap-stack px-1">
      <div>
        <p className="kicker text-label">
          {highlight?.kind === "id" ? (
            <Mark>{`#${String(pokemon.id).padStart(3, "0")}`}</Mark>
          ) : (
            `#${String(pokemon.id).padStart(3, "0")}`
          )}
          {pokemon.genus ? (
            <>
              {" · "}
              {highlight?.kind === "genus" ? <Mark>{pokemon.genus}</Mark> : pokemon.genus}
            </>
          ) : null}
        </p>
        <h3 className="text-title font-extrabold">
          {highlight?.kind === "name" ? <Mark>{formatName(pokemon.name)}</Mark> : formatName(pokemon.name)}
        </h3>
      </div>
      <p className="shrink-0 text-hp">
        <span className="text-title font-black">{pokemon.hp}</span>
        <span className="ml-inline text-caption font-black">HP</span>
      </p>
    </header>
  );
}

function TypeBadges({
  types,
  frame,
  highlight,
}: {
  frame: string;
  types: string[]
  highlight?: PokemonCardHighlight;
}) {
  return (
    <ul className="mt-stack flex flex-wrap gap-inline">
      {types.map((type) => {
        const darkText = DARK_TEXT_TYPES.has(type);
        const highlighted = highlight?.kind === "type" && highlight.text === type;

        return(
          <li
            key={type}
            className={`rounded-full px-stack py-0.5 text-caption font-bold ${
              darkText ? "text-ink" : "text-white"
            } ${highlighted ? "ring-2 ring-gold ring-offset-2 ring-offset-card" : ""}`}
            style={{ backgroundColor: TYPE_COLORS[type] ?? frame }}
          >
            {formatName(type)}
          </li>
      )})}
    </ul>
  )
}


function StatList({ stats }: { stats: Pokemon["stats"] }) {
  return (
    <div className="mt-stack border-y border-line text-small">
      {STAT_ENTRIES.map(([key, label]) => (
        <div className="flex items-center justify-between gap-section py-0.5" key={key}>
          <span>{label}</span>
          <span className={`tabular-nums`}>{stats[key]}</span>
        </div>
      ))}
    </div>
  );
}

export function PokemonCard({
  pokemon,
  priority = false,
  highlight,
  large = false,
}: {
  pokemon: PokemonCardData;
  priority?: boolean;
  highlight?: PokemonCardHighlight;
  large?: boolean;
}) {
  const frame = TYPE_COLORS[pokemon.types[0]] ?? TYPE_COLORS.normal;

  return (
    <CardFrame color={frame}>
      <CardHeader pokemon={pokemon} highlight={highlight} />
      <CardArtwork image={pokemon.image} priority={priority} large={large} />
      <TypeBadges frame={frame} types={pokemon.types} highlight={highlight} />
      <StatList stats={pokemon.stats} />

      <p className="mt-stack line-clamp-3 text-caption italic text-flavor">
        {pokemon.description}
      </p>

    </CardFrame>
  );
}
