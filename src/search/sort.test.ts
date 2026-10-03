import { describe, expect, it } from "vitest";

import { getPokedex } from "@/pokedex/load";
import { search } from "./search";
import { sortPokemon } from "./sort";
import type { Pokemon } from "@/pokedex/types";

function pokemon(id: number, speed: number): Pokemon {
  return {
    id,
    name: String(id),
    height_decimetres: 1,
    weight_hectograms: 1,
    base_experience: 1,
    types: [],
    stats: {
      hp: 1,
      attack: 1,
      defense: 1,
      "special-attack": 1,
      "special-defense": 1,
      speed,
    },
    abilities: [],
    moves: [],
    species: {
      generation: "",
      description: "",
      genus: "",
      color: "",
      shape: "",
      habitat: "",
      is_legendary: false,
      is_mythical: false,
      evolution_chain_id: 1,
    },
    images: { sprite: "", official_artwork: "" },
  };
}

describe("sortPokemon", () => {
  it("orders by the chosen stat and breaks ties with the Pokédex number", () => {
    const slow = pokemon(1, 40);
    const tiedLow = pokemon(2, 100);
    const tiedHigh = pokemon(10, 100);

    expect(sortPokemon([slow, tiedHigh, tiedLow], "speed", "desc", (item) => item).map((item) => item.id)).toEqual([
      2, 10, 1,
    ]);
    expect(sortPokemon([tiedHigh, slow, tiedLow], "speed", "asc", (item) => item).map((item) => item.id)).toEqual([
      1, 2, 10,
    ]);
  });

  it("orders a number sort from low to high", () => {
    const cards = [pokemon(25, 90), pokemon(101, 150), pokemon(81, 45)];

    expect(sortPokemon(cards, "id", "asc", (item) => item).map((item) => item.id)).toEqual([
      25, 81, 101,
    ]);
  });

  it("puts the fastest Electric Pokémon first when speed is chosen", async () => {
    const pokedex = await getPokedex();
    const direct = search(pokedex, "electric").pokemon;
    const names = sortPokemon(direct, "speed", "desc", (hit) => hit.item).map(
      (hit) => hit.item.name,
    );

    expect(names.slice(0, 9)).toEqual([
      "electrode",
      "jolteon",
      "raichu",
      "electabuzz",
      "voltorb",
      "zapdos",
      "pikachu",
      "magneton",
      "magnemite",
    ]);
  });
});
