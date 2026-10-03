"use client";

import { useEffect, useRef } from "react";

import { PokemonCard } from "./card";
import { PokemonCardData } from "./types";
import { formatName } from "../shared";

/** Large Pokémon card. Escape, the backdrop, or Close dismisses it. */
export function PokemonDialog({
  pokemon,
  onClose,
}: {
  pokemon: PokemonCardData;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node || node.open) return;
    node.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={formatName(pokemon.name)}
      className="m-auto w-[min(100vw-2rem,26rem)] border-0 bg-transparent p-0 backdrop:bg-ink/45"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <PokemonCard pokemon={pokemon} priority large />
    </dialog>
  );
}
