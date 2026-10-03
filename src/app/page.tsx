import { Suspense } from "react";

import { Search } from "@/components/search";
import { toPokemonCard } from "@/components/cards";
import { getPokedex } from "@/pokedex/load";

export default async function Home() {
  const pokedex = await getPokedex();
  const catalog = pokedex.pokemon.map(toPokemonCard);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-page px-4 py-page">
      <h1 className="pokedex-title text-center text-5xl sm:text-7xl">Pokedex</h1>
      <Suspense fallback={<p className="text-center">Loading search…</p>}>
        <Search catalog={catalog} />
      </Suspense>
    </main>
  );
}
