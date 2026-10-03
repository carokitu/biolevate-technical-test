import { PokemonSort, sortPokemon } from "@/search/sort";
import { GridCard } from "../cards";

export function orderCards(cards: GridCard[], sort: PokemonSort) {
    if (sort.key === "relevance") return cards;
  
    return sortPokemon(cards, sort.key, sort.direction, (card) => card.pokemon);
  }
  