import { Pokemon } from "@/pokedex/types";
import { PokemonCardData, PokemonCardHighlight } from "./types";
import { MatchSource, SearchHit } from "@/search/search";
import { GridCard } from "../types";
  
export function toPokemonCard(pokemon: Pokemon): PokemonCardData {
    return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        hp: pokemon.stats.hp,
        stats: pokemon.stats,
        genus: pokemon.species.genus,
        description: pokemon.species.description,
        image: pokemon.images.official_artwork || pokemon.images.sprite,
    };
}

export function cardHighlight(source: MatchSource): PokemonCardHighlight | undefined {
    if (
      source.kind === "id" ||
      source.kind === "name" ||
      source.kind === "type" ||
      source.kind === "genus"
    ) {
      return { kind: source.kind, text: source.text };
    }
  
    return undefined;
  }
  
export function pokemonCards(hits: SearchHit<Pokemon>[]): GridCard[] {
    return hits.map((hit) => ({
        pokemon: toPokemonCard(hit.item),
        highlight: cardHighlight(hit.source),
    }));
}
