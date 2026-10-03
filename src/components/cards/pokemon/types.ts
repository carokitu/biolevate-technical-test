import { Pokemon } from "@/pokedex/types";

export type PokemonCardData = {
    id: number;
    name: string;
    types: string[];
    hp: number;
    stats: Pokemon["stats"];
    genus: string;
    description: string;
    image: string;
};

export type PokemonCardHighlight = {
    kind: "id" | "name" | "type" | "genus";
    text: string;
  };