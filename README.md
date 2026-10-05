# Pokédex

Search across the first 151 Pokémon, their moves, and their abilities.

## Setup, run, and test

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
```

## Architecture and data flow

Next.js App Router. `pokedex.json` stays on the server. `getPokedex` reads it once and caches it. The home page turns Pokémon into cards for the client.

An empty box lists that catalog in the browser and does not call the API. A typed query waits 300 ms, then calls `GET /api/search?q=`. A missing or blank `q` returns 400. The route runs `search` and responds with `{ query, results }`. A read or parse failure returns 500.

`search` drops empty words, scores Pokémon, moves, and abilities, and orders the three sections by the closest name. Pokémon match on number, name, types, and genus. Moves and abilities match on name and short effect. No match shows an empty state. A failed search, or a file the page cannot read, shows the error screen.

## User needs

**A name only partly remembered.** `bulba` returns Bulbasaur and shows that the name matched.

**A fast Electric Pokémon.** `electric` returns those Pokémon with their stats. Speed is a sort control, so they can be compared.

**Sleep, without the vocabulary.** One question returns moves such as Sleep Powder and Sing, with the short effect that says why, and abilities whose short text mentions sleep.

**A rain team, in one search.** `rain` returns Rain Dish, Swift Swim, Dry Skin, and Hydration, each with the Pokémon that have it. Those Pokémon are not opened again as their own cards.

## Decisions and trade-offs

Relevance is a score, not a model. Equal to the word scores 3, a field that starts with it scores 2, and a word inside the field that starts with it scores 1. An exact number beats a padded number that only contains those digits. Scores add across the words. Two or more exact words get a bonus, so a name that covers more of the query beats one narrow hit. The closest name decides which section comes first. A tie stays Pokémon, then moves, then abilities.

A language model would handle paraphrase and negation better, but a wrong hit would be harder to explain. These needs are lexical, so the score stays in code.

Stop words are removed only when the query has several words. One token is always kept, so `do` still finds Dodrio. In a question, "how", "pokemon", "put", "target", "opponent", and "user" go, because they appear in too many texts.

The long effect is ignored. Fly's essay mentions Sleep Talk, but its short effect does not say sleep, so Fly is not a sleep result. Searching the essay would bury the useful hits.

Ability text is searched on the ability, not copied onto each Pokémon. Listing Bulbasaur again under Overgrow made a type or a move look like a name match.

"Fast" and "slow" are not sort instructions. The query finds the candidates. The control orders them. Search tests use `test-fixtures.ts`, so a new move in `pokedex.json` does not break them. The route tests still read the real file.

## Limitations and what I would do next

The suite does not check the shape from `getPokedex`, the sort, or the utils that turn a hit into a card. Those would be next.

"Prevents sleep." matches because the word is there. I would not parse the sentence. If the only hit sits next to "prevent", "cannot", or "immune", I would drop it.

The whole file is scored on every query. That is enough for 151 Pokémon. Beyond that I would cap the cards, then add an index only once the scan is slow. A question such as "faster than Pikachu" is not a bag of words. I would not parse it. Names and effects stay in the box. Type and speed stay in the controls.

A prefix also matches a genus, so Snorlax appears for "sleep". Letters from the middle of a word do not: `leep` does not find `sleep`. It keeps the start of a name, as in `bulba`. Inner letters such as `ing` would match dozens of unrelated words.

## Time

Approximately 12 hours, from 28 September to 5 October 2026.

## Representative queries

Results below are from `pokedex.json`, in relevance order, shortened to the hits that show the point.

**`bulba`**

Pokémon: Bulbasaur, matched on the name. No moves or abilities.

Demonstrates a prefix when the rest of the name is forgotten, and a result specific enough to confirm.

**`electric`**

Pokémon, matched on the type: Pikachu, Raichu, Magnemite, Magneton, Voltorb, Electrode, and the other Electric Pokémon. Moves include Thunder Shock, Thunderbolt, and Thunder. Sorting by Speed, high to low, puts Electrode (150), Jolteon (130), Raichu (110), Electabuzz (105), and Voltorb (100) first.

Demonstrates a practical filter and a comparison that is separate from the wording of the query.

**`How can I put an opponent to sleep?`**

Moves: Sleep Powder, Sing, Hypnosis, Dream Eater, Lovely Kiss, Spore, Rest. Sleep Powder is first because its name contains "sleep". Sing matches the short effect "Puts the target to sleep." Snorlax also appears, because its genus is Sleeping Pokémon. Abilities include Effect Spore, and also Insomnia, because its text says "Prevents sleep."

Demonstrates a question reduced to useful words, a name ranked above a mere mention, and the current limit on negation.

**`rain`**

Abilities only: Rain Dish (Blastoise, Squirtle, Tentacool, and others), Swift Swim (Goldeen, Golduck, Horsea, and others), Dry Skin, Hydration. No move, and Squirtle is not a separate Pokémon result.

Demonstrates one search that returns the abilities and the Pokémon that benefit, without a second query.

**`which pokemon fly?`**

The move Fly comes first, then the Flying-type Pokémon, starting with Charizard, Butterfree, and Pidgey, plus other Flying moves such as Gust and Wing Attack. Dugtrio is not in the Pokémon list. It stays on Arena Trap, whose text mentions Flying-types.

Demonstrates that "pokemon" is ignored in a question, that a section follows the closest name, and that an ability holder is not promoted to a Pokémon card.

## Validation

`npm test` covers an empty query (400), a real retrieval (`pikachu`, 200), a query with no match, and the four needs on the local fixture. The sleep case checks the score: Sleep Powder ranks before Sing, and Fly does not match. Those five queries were checked on `pokedex.json`. The screen was checked for the empty catalog, a mixed result, and the error screen.

## AI tools

I used Cursor as a pair programmer while building this app. I described the behavior I wanted, often from a search result or a line of code, and the assistant wrote or edited the implementation. The suggestions were reviewed and changed.
Search ranking does not call a model. It is the scoring in `src/search`.
