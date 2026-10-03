import { NextRequest, NextResponse } from "next/server";

import { getPokedex } from "@/pokedex/load";
import { search, type SearchResults } from "@/search/search";

export type SearchResponse = {
  query: string;
  results: SearchResults;
};

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
    const results = search(pokedex, query);

    const body: SearchResponse = { query, results };

    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Unable to search the Pokédex." },
      { status: 500 },
    );
  }
}