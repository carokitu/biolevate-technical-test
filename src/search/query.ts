const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "how",
  "can",
  "i",
  "my",
  "me",
  "do",
  "what",
  "which",
  "is",
  "with",
  // These do not say what to find. "put" and "target" show up in most effect texts.
  "put",
  "pokemon",
  "pokemons",
  "target",
  "targets",
]);

/**
 * Words worth searching for.
 * One word is always kept, so a short prefix like "do" still matches.
 * In a longer phrase, words shorter than 3 letters and words like "the" or "pokemon" are dropped.
 */
export function extractSearchTerms(query: string): string[] {
  const tokens = [
    ...new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 0),
    ),
  ];

  if (tokens.length <= 1) return tokens;

  return tokens.filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
}
