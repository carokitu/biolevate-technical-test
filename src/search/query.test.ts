import { describe, expect, it } from "vitest";

import { extractSearchTerms } from "./query";

describe("extractSearchTerms", () => {
  it("keeps opponent and user, and still drops target", () => {
    expect(extractSearchTerms("How can I put an opponent to sleep?")).toEqual([
      "opponent",
      "sleep",
    ]);
    expect(extractSearchTerms("put the user to sleep")).toEqual([
      "user",
      "sleep",
    ]);
    expect(extractSearchTerms("put the target to sleep")).toEqual(["sleep"]);
  });

  it("keeps a single short lookup such as a name prefix", () => {
    expect(extractSearchTerms("bul")).toEqual(["bul"]);
    expect(extractSearchTerms("muk")).toEqual(["muk"]);
    expect(extractSearchTerms("do")).toEqual(["do"]);
  });

  it("normalizes case and surrounding spaces", () => {
    expect(extractSearchTerms("  BULBA ")).toEqual(["bulba"]);
  });

  it("strips punctuation from a single word", () => {
    expect(extractSearchTerms("sleep?")).toEqual(["sleep"]);
  });

  it("returns an empty list when the query is only stop words", () => {
    expect(extractSearchTerms("how can I")).toEqual([]);
    expect(extractSearchTerms("   ")).toEqual([]);
  });

  it("keeps fly from a question about which pokemon fly", () => {
    expect(extractSearchTerms("which pokemon fly?")).toEqual(["fly"]);
  });

  it("drops stop words only when the query has several words", () => {
    expect(extractSearchTerms("target")).toEqual(["target"]);
    expect(extractSearchTerms("do sleep")).toEqual(["sleep"]);
  });
});
