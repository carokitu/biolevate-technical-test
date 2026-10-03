import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Pokedex } from "./types";

let pokedex: Pokedex | null = null;

/** Reads pokedex.json once and reuses it for later searches. */
export async function getPokedex(): Promise<Pokedex> {
  if (pokedex) {
    return pokedex;
  }

  const filePath = path.join(process.cwd(), "pokedex.json");
  const file = await readFile(filePath, "utf-8");

  pokedex = JSON.parse(file) as Pokedex;

  return pokedex;
}