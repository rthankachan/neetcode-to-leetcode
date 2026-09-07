# NeetCode 150 → LeetCode lists

Creates 18 LeetCode custom lists — one per NeetCode roadmap category — containing all 150 NeetCode 150 problems, numbered in roadmap order and set private.

Solve on LeetCode, keep NeetCode's categorisation. No NeetCode subscription needed; the 150 list is free.

## Files

- **`neetcode-to-leetcode.js`** — the whole thing. Self-contained; the 150 problems are embedded. This is the only file you need.
- `README.md` — this file.

## Running it

1. Log in to LeetCode.
2. Go to exactly `https://leetcode.com/problemset/`. The script refuses to run anywhere else.
3. Open DevTools (F12) → **Console**. If pasting is blocked, type `allow pasting` first.
4. Paste the entire file, press Enter. It **plans only** and stops — nothing is written.
5. Review the plan, then run `ncRun()`.

Takes about two minutes. Requires LeetCode Premium only for the handful of premium-locked problems; everything else works on a free account.

## Commands

| Command | Effect |
|---|---|
| `ncPlan()` | Read-only. Shows what would be created, reused, renamed. |
| `ncRun()` | Does the work. Creates, fills, renames, sets private. |
| `ncVerify()` | Read-only audit. Flags missing lists, short counts, public lists. |

## Configuration

Edit `CONFIG` at the top:

- `namePrefix` — default `"NC"`, giving `NC 01 · Arrays & Hashing`
- `numbered` — `false` drops the numbers and the roadmap ordering
- `makePrivate` — `false` leaves lists public (LeetCode's default is public)
- `delayMs` — raise to `800` if you hit rate limits
- `maxRetries` — retries per failed call, with backoff

## Is it idempotent?

Effectively yes — re-running converges on the same end state rather than duplicating anything. Specifically:

- Lists are matched **by name** and reused, not recreated.
- Re-adding problems is a no-op; LeetCode dedupes.
- Renaming and visibility are set to the same target values each time.

So if a run half-fails, just run it again. Two caveats:

- It isn't a literal no-op — a re-run still re-sends every call, taking the same two minutes.
- Matching is by name. If you rename the lists yourself, the script won't recognise them and will create fresh ones. Change `CONFIG.namePrefix` to match instead.

It matches both `NC 01 · Trees` and the older unnumbered `NC · Trees`, so upgrading an earlier run renames in place rather than duplicating.

## Safety

- Only runs on `https://leetcode.com/problemset/`; re-checked before every request.
- One `fetch`, to a hard-coded `https://leetcode.com/graphql/`. No third parties, no external URLs, no `eval`, no storage writes.
- `credentials: "same-origin"` — the browser refuses to send cookies cross-origin.
- Your session cookie is never read by the script. The CSRF token is read from `document.cookie` and used only in the header of that one request.
- Lists not matching the prefix are never touched.
- Success is verified by re-querying LeetCode, not by trusting mutation replies.
- If the first category fails, it aborts rather than repeating the error 17 times.

To watch it yourself: open the **Network** tab, filter to `graphql`, and every request is visible as it happens.

## Schema notes

LeetCode's GraphQL API is undocumented and changes. Current shape, verified September 2026:

```
query    myCreatedFavoriteList { favorites { slug name questionNumber isPublicFavorite } }
create   createEmptyFavorite(favoriteType: NORMAL, name)
add      batchAddQuestionsToFavorite(favoriteSlug, questionSlugs)
rename   updateFavoriteNameDescriptionV2(favoriteSlug, name, description)
private  updateFavoriteIsPublicV2(favoriteSlug, isPublic)
```

Traps worth knowing if it breaks:

- The list identifier is `slug`. `idHash` was removed and older scripts using it fail.
- `favoriteType` is an enum; `NORMAL` is the value for a user list.
- `updateFavoriteNameDescriptionV2` declares `description` **optional**, but the server resolver throws without it. Always send it, even as `""`.
- **HTTP 200 does not mean success.** A failure can arrive as 200 with a `null` payload plus a populated `errors[]`, or as `ok: false` inside the payload. The script checks all three.

If LeetCode changes the schema, the error messages are informative — they name the invalid field and often suggest the correct one. Sending a mutation with an invalid *argument* name makes the server list the valid arguments, and that fails validation so nothing executes.

## Updating the problem list

The 150 problems live in the `NEETCODE_150` object in the script, keyed by category, values are LeetCode slugs (the last path segment of a problem URL). Edit it directly if NeetCode revises the list. Category key order determines the numbering.
