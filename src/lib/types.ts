const STAT_FIELDS = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ] as const;
  
type StatField = (typeof STAT_FIELDS)[number];
  
type Stats = Record<StatField, number>;

type Species = {
    generation: string;
    description: string;
    genus: string;
    color: string;
    shape: string;
    habitat: string;
    is_legendary: boolean;
    is_mythical: boolean;
    evolution_chain_id: number;
}

type Image = {
    sprite: string;
    official_artwork: string;
}

export type Pokemon = {
    id: number;
    name: string;
    height_decimetres: number;
    weight_hectograms: number;
    base_experience: number;
    types: string[];
    stats: Stats;
    abilities: string[];
    moves: string[];
    species: Species;
    images: Image;
};

export type Move = {
    id: number;
    name: string;
    type: string;
    power: number | null;
    pp: number;
    accuracy: number | null;
    priority: number;
    damage_class: string;
    effect_chance: number | null;
    effect: string;
    short_effect: string;
    generation: string;
    learned_by_pokemon: string[];
};

export type Ability = {
    id: number;
    name: string;
    effect: string;
    short_effect: string;
    generation: string;
    is_main_series: boolean;
    pokemon: string[];
};

export type Pokedex = {
    metadata: {
        schema_version: number;
        source: string;
        scope: string;
        version_groups: string[];
    };
    pokemon: Pokemon[];
    moves: Move[];
    abilities: Ability[];
};
