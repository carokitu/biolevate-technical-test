import { PokemonCard } from "@/components/cards";

import type { GridCard } from "./types";

export function CardGrid({ cards }: { cards: GridCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-section sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((entry, index) => (
        <li key={entry.pokemon.id}>
          <PokemonCard
            pokemon={entry.pokemon}
            priority={index < 4}
            highlight={entry.highlight}
          />
        </li>
      ))}
    </ul>
  );
}
