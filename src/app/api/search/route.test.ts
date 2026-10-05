import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET, type SearchResponse } from "./route";

function searchRequest(query?: string) {
  const url = new URL("http://localhost/api/search");

  if (query !== undefined) {
    url.searchParams.set("q", query);
  }

  return new NextRequest(url);
}

async function bodyOf(response: Response) {
  return (await response.json()) as SearchResponse;
}

describe("GET /api/search", () => {
  it("rejects an empty query", async () => {
    const missing = await GET(searchRequest());
    const blank = await GET(searchRequest("   "));

    expect(missing.status).toBe(400);
    await expect(missing.json()).resolves.toEqual({ error: "Query is required." });

    expect(blank.status).toBe(400);
    await expect(blank.json()).resolves.toEqual({ error: "Query is required." });
  });

  it("returns the Pokémon that matches the query", async () => {
    const response = await GET(searchRequest("pikachu"));
    const body = await bodyOf(response);

    expect(response.status).toBe(200);
    expect(body.query).toBe("pikachu");
    expect(body.results.pokemon.map((pokemon) => pokemon.item.name)).toContain("pikachu");
  });

  it("returns no matches when nothing fits", async () => {
    const response = await GET(searchRequest("no-such-thing"));
    const body = await bodyOf(response);

    expect(response.status).toBe(200);
    expect(body.results.pokemon).toEqual([]);
    expect(body.results.moves).toEqual([]);
    expect(body.results.abilities).toEqual([]);
  });
});
