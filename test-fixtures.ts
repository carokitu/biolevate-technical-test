import type { Ability, Move, Pokedex, Pokemon } from "@/pokedex/types";

const stats = {
  hp: 40,
  attack: 40,
  defense: 40,
  "special-attack": 40,
  "special-defense": 40,
  speed: 40,
};

function pokemon(
  fields: Pick<Pokemon, "id" | "name" | "types"> & { speed?: number },
): Pokemon {
  return {
    id: fields.id,
    name: fields.name,
    height_decimetres: 1,
    weight_hectograms: 1,
    base_experience: 1,
    types: fields.types,
    stats: { ...stats, speed: fields.speed ?? stats.speed },
    abilities: [],
    moves: [],
    species: {
      generation: "generation-i",
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

function move(
  fields: Pick<Move, "id" | "name" | "short_effect"> &
    Partial<Pick<Move, "effect" | "learned_by_pokemon">>,
): Move {
  return {
    id: fields.id,
    name: fields.name,
    type: "normal",
    power: null,
    pp: 15,
    accuracy: null,
    priority: 0,
    damage_class: "status",
    effect_chance: null,
    effect: fields.effect ?? fields.short_effect,
    short_effect: fields.short_effect,
    generation: "generation-i",
    learned_by_pokemon: fields.learned_by_pokemon ?? [],
  };
}

function ability(
  fields: Pick<Ability, "id" | "name" | "short_effect" | "pokemon">,
): Ability {
  return {
    id: fields.id,
    name: fields.name,
    effect: fields.short_effect,
    short_effect: fields.short_effect,
    generation: "generation-i",
    is_main_series: true,
    pokemon: fields.pokemon,
  };
}

/** A tiny catalog. Search tests use this instead of pokedex.json. */
export const pokedex: Pokedex = {
  metadata: {
    schema_version: 1,
    source: "test",
    scope: "test",
    version_groups: [],
  },
  pokemon: [
    pokemon({ id: 1, name: "bulbasaur", types: ["grass", "poison"] }),
    pokemon({ id: 7, name: "squirtle", types: ["water"] }),
    pokemon({ id: 25, name: "pikachu", types: ["electric"], speed: 90 }),
    pokemon({ id: 101, name: "electrode", types: ["electric"], speed: 150 }),
    pokemon({ id: 118, name: "goldeen", types: ["water"] }),
  ],
  moves: [
    move({
      id: 47,
      name: "sing",
      short_effect: "Puts the target to sleep.",
    }),
    move({
      id: 79,
      name: "sleep-powder",
      short_effect: "Puts the target to sleep.",
      learned_by_pokemon: ["bulbasaur"],
    }),
    move({
      id: 19,
      name: "fly",
      short_effect: "User flies high into the air, then hits next turn.",
      effect: "This move cannot be selected by Sleep Talk.",
    }),
  ],
  abilities: [
    ability({
      id: 27,
      name: "effect-spore",
      short_effect: "Contact may put the attacker to sleep.",
      pokemon: ["paras"],
    }),
    ability({
      id: 44,
      name: "rain-dish",
      short_effect: "Heals during rain.",
      pokemon: ["squirtle"],
    }),
    ability({
      id: 33,
      name: "swift-swim",
      short_effect: "Doubles Speed during rain.",
      pokemon: ["goldeen"],
    }),
    ability({
      id: 22,
      name: "intimidate",
      short_effect: "Lowers opponents' Attack one stage upon entering battle.",
      pokemon: ["ekans"],
    }),
  ],
};
