"use client";

import Image from "next/image";
import { useState } from "react";

import { formatName} from "./utils";
import { PokemonDialog, type PokemonCardData } from "../pokemon";

function RosterImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="h-7 shrink-0" />;
  }

  return (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      unoptimized
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-7 w-7 object-contain"
    />
  );
}

export function PokemonRoster({
  names,
  catalog,
}: {
  names: string[];
  catalog: Map<string, PokemonCardData>;
}) {
  const pokemon = names.flatMap((name) => {
    const entry = catalog.get(name);
    return entry ? [entry] : [];
  });

  const [selected, setSelected] = useState<PokemonCardData | null>(null);

  if (pokemon.length === 0) return null;

  return (
    <div className="mt-section">
      <p className="kicker text-muted">Pokémon</p>
      <ul className="mt-stack flex max-h-40 flex-wrap gap-inline overflow-y-auto p-1">
        {pokemon.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-inline rounded-full bg-white/80 py-0.5 pr-stack pl-0.5 transition duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_16px_rgb(140_50_80/0.22)]"
              onClick={() => setSelected(entry)}
            >
              <RosterImage src={entry.image} />
              <span className="text-caption text-ink">{formatName(entry.name)}</span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? <PokemonDialog pokemon={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
