import { describe, expect, it } from "vitest";
import { getPokedex } from "@/pokedex/load";
import { search, searchAbilities, searchMoves, searchPokemon } from "./search";
import type { Pokedex } from "@/pokedex/types";

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
    {
      id: 4,
      name: "reflect",
      type: "psychic",
      power: null,
      pp: 20,
      accuracy: null,
      priority: 0,
      damage_class: "status",
      effect_chance: null,
      effect: "Reduces damage from physical attacks. An opponent can remove it.",
      short_effect: "Reduces damage from physical attacks.",
      generation: "generation-i",
      learned_by_pokemon: [],
    },
    {
      id: 5,
      name: "fly",
      type: "flying",
      power: 90,
      pp: 15,
      accuracy: 95,
      priority: 0,
      damage_class: "physical",
      effect_chance: null,
      effect: "This move cannot be selected by Sleep Talk.",
      short_effect: "User flies high into the air, then hits next turn.",
      generation: "generation-i",
      learned_by_pokemon: [],
    },
    {
      id: 6,
      name: "karate-chop",
      type: "fighting",
      power: 50,
      pp: 25,
      accuracy: 100,
      priority: 0,
      damage_class: "physical",
      effect_chance: null,
      effect: "Inflicts regular damage.",
      short_effect: "Higher critical hit rate when using this move.",
      generation: "generation-i",
      learned_by_pokemon: [],
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

    it("finds sleep moves from a question and ignores battle-role words", () => {
      const results = searchMoves(
        pokedex,
        "How can I put an opponent to sleep?",
      );

      expect(results.map((move) => move.name)).toEqual([
        "sleep-powder",
        "sing",
      ]);
    });

    it("ranks a move that matches more of the query first", () => {
      const results = searchMoves(pokedex, "sleep powder");

      expect(results.map((move) => move.name)).toEqual([
        "sleep-powder",
        "sing",
      ]);
    });

    it("ranks two exact words above a single exact name", () => {
      const catalog: Pokedex = {
        ...pokedex,
        moves: [
          { ...pokedex.moves[1], id: 7, name: "powder" },
          ...pokedex.moves,
        ],
      };

      const results = searchMoves(catalog, "sleep powder");

      expect(results[0].name).toBe("sleep-powder");
    });

    it("returns no matches when the question has no searchable term", () => {
      expect(searchMoves(pokedex, "how can I")).toEqual([]);
    });

    it("ignores a mention that only appears in the long effect text", () => {
      const results = searchMoves(pokedex, "sleep");

      expect(results.map((move) => move.name)).not.toContain("fly");
    });

    it("does not match a query inside another word", () => {
      const results = searchMoves(pokedex, "sing");

      expect(results.map((move) => move.name)).toEqual(["sing"]);
    });
  });

describe("searchPokemon", () => {
    it("finds Pokémon by a partial name", () => {
        const results = searchPokemon(pokedex, "bulba");

        expect(results.map((pokemon) => pokemon.name)).toEqual(["bulbasaur"]);
    });

    it("ranks names starting with the query first", () => {
        const results = searchPokemon(pokedex, "bul");

        expect(results[0].name).toBe("bulbasaur");
    });

    it("returns an empty array for an empty query", () => {
        expect(searchPokemon(pokedex, "")).toEqual([]);
    });
});

describe("searchAbilities", () => {
    it("finds an ability through its effect", () => {
        const results = searchAbilities(pokedex, "sleep");

        expect(results.map((ability) => ability.name)).toContain("vital-spirit");
    });
});

describe("search", () => {
    it("searches across all entity types and prioritizes name matches", () => {
        const results = search(pokedex, "sleep");
    
        expect(results.moves.map((move) => move.item.name)).toContain("sing");
        expect(results.abilities.map((ability) => ability.item.name)).toContain(
        "vital-spirit",
        );
    });

    it("keeps sleep moves first when the question also says opponent", () => {
      const results = search(pokedex, "How can I put an opponent to sleep?");

      expect(results.moves[0].item.name).toBe("sleep-powder");
      expect(results.moves.map((move) => move.item.name)).not.toContain("fly");
    });
});

describe("search on the dataset", () => {
  it("matches sleep in the short text and not in the long essay", async () => {
    const pokedex = await getPokedex();
    const names = search(pokedex, "sleep").moves.map((move) => move.item.name);

    expect(names).toEqual([
      "sleep-powder",
      "sing",
      "hypnosis",
      "dream-eater",
      "lovely-kiss",
      "spore",
      "rest",
    ]);
  });

  it("ranks sleep moves above texts that only mention the opponent", async () => {
    const pokedex = await getPokedex();
    const names = search(
      pokedex,
      "How can I put an opponent to sleep?",
    ).moves.map((move) => move.item.name);

    expect(names[0]).toBe("sleep-powder");
    expect(names).toContain("sing");
    expect(names).not.toContain("fly");
  });

  it("finds a partial name", async () => {
    const pokedex = await getPokedex();

    const names = searchPokemon(pokedex, "bul").map((pokemon) => pokemon.name);

    expect(names[0]).toBe("bulbasaur");
    expect(names).toContain("tauros");
  });

  it("finds a Pokémon by its id, with or without leading zeros", async () => {
    const pokedex = await getPokedex();

    expect(searchPokemon(pokedex, "25").map((pokemon) => pokemon.name)[0]).toBe("pikachu");
    expect(searchPokemon(pokedex, "025").map((pokemon) => pokemon.name)).toEqual(["pikachu"]);
    expect(searchPokemon(pokedex, "1")[0]?.name).toBe("bulbasaur");
    expect(searchPokemon(pokedex, "001")[0]?.name).toBe("bulbasaur");
  });

  it("matches a digit anywhere in the padded number", async () => {
    const pokedex = await getPokedex();
    const ids = searchPokemon(pokedex, "2").map((pokemon) => pokemon.id);

    expect(ids.slice(0, 5)).toEqual([2, 12, 20, 21, 22]);
    expect(ids).toEqual(ids.filter((id) => String(id).padStart(3, "0").includes("2")));
  });

  it("finds Dodrio from the prefix do", async () => {
    const pokedex = await getPokedex();
    const names = searchPokemon(pokedex, "do").map((pokemon) => pokemon.name);

    expect(names).toContain("dodrio");
  });

  it("finds Pokémon by type and genus, and keeps ability holders on the ability", async () => {
    const pokedex = await getPokedex();

    expect(search(pokedex, "electric").pokemon[0]?.item.name).toBe("pikachu");
    expect(search(pokedex, "overgrow").pokemon).toEqual([]);
    expect(
      search(pokedex, "overgrow").abilities.find((ability) => ability.item.name === "overgrow")
        ?.item.pokemon,
    ).toEqual(["bulbasaur", "ivysaur", "venusaur"]);
    expect(search(pokedex, "seed").pokemon.map((pokemon) => pokemon.item.name)).toEqual([
      "bulbasaur",
      "ivysaur",
      "venusaur",
    ]);
    expect(search(pokedex, "leaf").pokemon.map((pokemon) => pokemon.item.name)).not.toContain(
      "tangela",
    );
  });

  it("does not treat speed words as a sort instruction", async () => {
    const pokedex = await getPokedex();

    expect(search(pokedex, "fast electric").pokemon[0]?.item.name).toBe("pikachu");
    expect(search(pokedex, "slow electric").pokemon[0]?.item.name).toBe("pikachu");
  });

  it("finds rain abilities and the Pokémon that have them", async () => {
    const pokedex = await getPokedex();
    const results = search(pokedex, "rain");

    expect(results.moves).toEqual([]);
    expect(results.abilities.map((ability) => ability.item.name)).toEqual([
      "rain-dish",
      "swift-swim",
      "dry-skin",
      "hydration",
    ]);
    expect(results.abilities.find((ability) => ability.item.name === "swift-swim")?.item.pokemon).toContain(
      "goldeen",
    );
    expect(results.abilities.find((ability) => ability.item.name === "rain-dish")?.item.pokemon).toContain(
      "squirtle",
    );
    expect(results.pokemon.map((pokemon) => pokemon.item.name)).not.toContain("squirtle");
    expect(results.pokemon.map((pokemon) => pokemon.item.name)).not.toContain("eevee");
  });

  it("keeps a flying type and leaves ability holders on the ability", async () => {
    const pokedex = await getPokedex();
    const results = search(pokedex, "flying");
    const pidgey = results.pokemon.find((pokemon) => pokemon.item.name === "pidgey");

    expect(pidgey?.exact).toBe(true);
    expect(pidgey?.source).toEqual({ kind: "type", text: "flying" });
    expect(results.pokemon.map((pokemon) => pokemon.item.name)).not.toContain("dugtrio");
    expect(results.abilities.find((ability) => ability.item.name === "arena-trap")?.item.pokemon).toContain(
      "dugtrio",
    );
  });

  it("finds flying Pokémon from a question", async () => {
    const pokedex = await getPokedex();
    const results = search(pokedex, "which pokemon fly?");

    expect(results.pokemon.map((pokemon) => pokemon.item.name)).toContain("pidgey");
    expect(results.moves.map((move) => move.item.name)).toContain("fly");
    expect(results.pokemon.map((pokemon) => pokemon.item.name)).not.toContain("dugtrio");
  });

  it("leads with the group whose name matches the query most closely", async () => {
    const pokedex = await getPokedex();

    expect(search(pokedex, "ratt").order[0]).toBe("pokemon");
    expect(search(pokedex, "ratt").pokemon[0]?.item.name).toBe("rattata");
    expect(search(pokedex, "rattl").order[0]).toBe("abilities");
    expect(search(pokedex, "rattled").order[0]).toBe("abilities");
    expect(search(pokedex, "rattled").abilities[0]?.item.name).toBe("rattled");
  });
});