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

describe("GET /api/search", () => {
  it("rejects a missing query", async () => {
    const response = await GET(searchRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Query is required.",
    });
  });

  it("rejects a blank query", async () => {
    const response = await GET(searchRequest("   "));

    expect(response.status).toBe(400);
  });

  it("returns sleep moves for a question", async () => {
    const response = await GET(
      searchRequest("How can I put an opponent to sleep?"),
    );

    expect(response.status).toBe(200);

    const body = (await response.json()) as SearchResponse;

    expect(body.query).toBe("How can I put an opponent to sleep?");
    expect(body.results.moves.map((move) => move.item.name)).toContain("sing");
    expect(body.results.moves.map((move) => move.item.name)).not.toContain("fly");
  });

  it("returns empty lists when nothing matches", async () => {
    const response = await GET(searchRequest("no-such-thing"));

    expect(response.status).toBe(200);

    const body = (await response.json()) as SearchResponse;

    expect(body.results.pokemon).toEqual([]);
    expect(body.results.moves).toEqual([]);
    expect(body.results.abilities).toEqual([]);
  });
});
