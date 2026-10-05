import { describe, expect, it } from "vitest";

import { search } from "./search";
import { pokedex } from "@/../test-fixtures";

describe("search", () => {
  it("recovers the Pokémon whose name starts with bulba", () => {
    const matches = search(pokedex, "bulba").pokemon;

    expect(matches.map((pokemon) => pokemon.item.name)).toEqual(["bulbasaur"]);
    expect(matches[0]?.source).toEqual({ kind: "name", text: "bulbasaur" });
  });

  it("lists Electric Pokémon", () => {
    const candidates = search(pokedex, "electric").pokemon;

    expect(candidates.map((pokemon) => pokemon.item.name)).toEqual(["pikachu", "electrode"]);
  });

  it("answers how to put an opponent to sleep from moves and abilities", () => {
    const results = search(pokedex, "How can I put an opponent to sleep?");
    const sleepPowder = results.moves[0];
    const sing = results.moves.find((move) => move.item.name === "sing");
    const effectSpore = results.abilities.find((ability) => ability.item.name === "effect-spore");

    expect(sleepPowder?.item.name).toBe("sleep-powder");
    expect(sleepPowder?.source.kind).toBe("name");

    expect(sing?.source).toEqual({
      kind: "short_effect",
      text: "Puts the target to sleep.",
    });

    expect(effectSpore?.source).toEqual({
      kind: "short_effect",
      text: "Contact may put the attacker to sleep.",
    });

    expect(results.moves.map((move) => move.item.name)).not.toContain("fly");
  });

  it("finds rain abilities and the Pokémon that have them in one search", () => {
    const results = search(pokedex, "rain");
    const names = results.abilities.map((ability) => ability.item.name);
    const swiftSwim = results.abilities.find((ability) => ability.item.name === "swift-swim")?.item.pokemon;
    const rainDish = results.abilities.find((ability) => ability.item.name === "rain-dish")?.item.pokemon;
    const pokemonNames = results.pokemon.map((pokemon) => pokemon.item.name);

    expect(names).toHaveLength(2);
    expect(names).toEqual(["rain-dish", "swift-swim"]);
    expect(names).not.toContain("effect-spore");

    expect(swiftSwim).toHaveLength(1);
    expect(swiftSwim).toContain("goldeen");
    expect(swiftSwim).not.toContain("squirtle");

    expect(rainDish).toHaveLength(1);
    expect(rainDish).toContain("squirtle");
    expect(rainDish).not.toContain("goldeen");

    expect(results.moves).toHaveLength(0);
    expect(pokemonNames).toHaveLength(0);
    expect(pokemonNames).not.toContain("squirtle");
    expect(pokemonNames).not.toContain("goldeen");
  });
});
