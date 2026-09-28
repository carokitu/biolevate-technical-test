import { NextRequest, NextResponse } from "next/server";

import { getPokedex } from "@/lib/data";
import { searchPokemonByName } from "@/lib/search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Query is required." },
      { status: 400 },
    );
  }

  try {
    const pokedex = await getPokedex();
    const pokemon = searchPokemonByName(pokedex, query);

    return NextResponse.json({
      query,
      results: pokemon,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to search the Pokédex." },
      { status: 500 },
    );
  }
}