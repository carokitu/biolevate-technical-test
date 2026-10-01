import { describe, expect, it } from "vitest";
import { getPokemonForMove, search, searchAbilities, searchMoves, searchPokemonByName } from "./search";
import type { Pokedex } from "./types";

const pokedex: Pokedex = {
  metadata: {
    schema_version: 1,
    source: "",
    scope: "",
    version_groups: [],
  },
  pokemon: [
    {
      id: 1,
      name: "bulbasaur",
      height_decimetres: 7,
      weight_hectograms: 69,
      base_experience: 64,
      types: ["grass", "poison"],
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        "special-attack": 65,
        "special-defense": 65,
        speed: 45,
      },
      abilities: ["overgrow"],
      moves: [],
      species: {
        generation: "generation-i",
        description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
        genus: "Seed Pokémon",
        color: "green",
        shape: "quadruped",
        habitat: "grassland",
        is_legendary: false,
        is_mythical: false,
        evolution_chain_id: 1,
      },
      images: {
        sprite: '',
        official_artwork: '',
      },
    },
    {
      id: 2,
      name: "ivysaur",
      height_decimetres: 10,
      weight_hectograms: 130,
      base_experience: 142,
      types: ["grass", "poison"],
      stats: {
        hp: 60,
        attack: 62,
        defense: 63,
        "special-attack": 80,
        "special-defense": 80,
        speed: 60,
      },
      abilities: ["overgrow"],
      moves: [],
      species: {
        generation: "generation-i",
        description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
        genus: "Seed Pokémon",
        color: "green",
        shape: "quadruped",
        habitat: "grassland",
        is_legendary: false,
        is_mythical: false,
        evolution_chain_id: 1,
      },
      images: {
        sprite: '',
        official_artwork: '',
      },
    },
  ],
  moves: [
    {
      id: 1,
      name: "sing",
      type: "normal",
      power: null,
      pp: 15,
      accuracy: 55,
      priority: 0,
      damage_class: "status",
      effect_chance: null,
      effect: "Puts the target to sleep.",
      short_effect: "Puts the target to sleep.",
      generation: "generation-i",
      learned_by_pokemon: ["bulbasaur"],
    },
    {
      id: 2,
      name: "tackle",
      type: "normal",
      power: 40,
      pp: 35,
      accuracy: 95,
      priority: 0,
      damage_class: "physical",
      effect: "Inflicts regular damage.",
      effect_chance: null,
      short_effect: "Inflicts regular damage.",
      generation: "generation-i",
      learned_by_pokemon: ["bulbasaur"],
    },
    {
      id: 3,
      name: "sleep-powder",
      type: "normal",
      power: 40,
      pp: 35,
      accuracy: 95,
      priority: 0,
      damage_class: "physical",
      effect: "Puts the target to sleep.",
      effect_chance: null,
      short_effect: "Puts the target to sleep.",
      generation: "generation-i",
      learned_by_pokemon: ["ivysaur"],
    },
  ],
  abilities: [
    {
      id: 1,
      name: "vital-spirit",
      effect: "Prevents sleep.",
      short_effect: "Prevents sleep.",
      generation: "generation-iii",
      is_main_series: true,
      pokemon: ["primeape"],
    },
  ],
};

describe("searchMoves", () => {
    it("finds a move through its effect, not only its name", () => {
      const results = searchMoves(pokedex, "sleep");
  
      expect(results.map((move) => move.name)).toContain("sing");
    });
  
    it("matches move names case-insensitively", () => {
      const results = searchMoves(pokedex, "SING");
  
      expect(results.map((move) => move.name)).toContain("sing");
    });
  
    it("returns an empty array for an empty query", () => {
      expect(searchMoves(pokedex, "   ")).toEqual([]);
    });
  
    it("returns an empty array for an unknown query", () => {
      expect(searchMoves(pokedex, "pikachu")).toEqual([]);
    });

    it("ranks an exact name match before effect matches", () => {
        const results = searchMoves(pokedex, "sing");
      
        expect(results[0].name).toBe("sing");
    });

    it("finds multiple moves through their effect and prioritizes name matches", () => {
        const results = searchMoves(pokedex, "sleep");
      
        expect(results.map((move) => move.name)).toEqual([
            "sleep-powder",
            "sing",
        ]);
      });
  });

describe("searchPokemonByName", () => {
    it("finds Pokémon by a partial name", () => {
        const results = searchPokemonByName(pokedex, "bulba");

        expect(results.map((pokemon) => pokemon.name)).toEqual(["bulbasaur"]);
    });

    it("ranks names starting with the query first", () => {
        const results = searchPokemonByName(pokedex, "bul");

        expect(results[0].name).toBe("bulbasaur");
    });

    it("returns an empty array for an empty query", () => {
        expect(searchPokemonByName(pokedex, "")).toEqual([]);
    });
});

describe("searchAbilities", () => {
    it("finds an ability through its effect", () => {
        const results = searchAbilities(pokedex, "sleep");

        expect(results.map((ability) => ability.name)).toContain("vital-spirit");
    });
});

describe("getPokemonForMove", () => {
    it("finds Pokémon that can learn a move", () => {
        const move = pokedex.moves.find((move) => move.name === "sing")!;
      
        const results = getPokemonForMove(pokedex, move);
      
        expect(results.map((pokemon) => pokemon.name)).toContain("bulbasaur");
      });
});

describe("search", () => {
    it("searches across all entity types and prioritizes name matches", () => {
        const results = search(pokedex, "sleep");
    
        expect(results.moves.map((move) => move.name)).toContain("sing");
        expect(results.abilities.map((ability) => ability.name)).toContain(
        "vital-spirit",
        );
    });
});