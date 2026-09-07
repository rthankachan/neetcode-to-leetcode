// ============================================================================
// neetcode-to-leetcode.js
//
// Creates 18 LeetCode lists (one per NeetCode roadmap category) containing all
// 150 NeetCode 150 problems, numbered in roadmap order and set private.
//
// Self-contained: no other files needed. Safe to re-run.
//
//   1. Log in to LeetCode.
//   2. Go to exactly:  https://leetcode.com/problemset/
//   3. DevTools console (F12). If it blocks pasting, type: allow pasting
//   4. Paste this whole file, Enter. It PLANS ONLY and stops.
//   5. Review the plan, then run:  ncRun()
//
// Verified against the live LeetCode GraphQL schema, Sept 2026.
// ============================================================================

const CONFIG = {
  namePrefix: "NC",          // -> "NC 01 · Arrays & Hashing"
  numbered:   true,          // false -> "NC · Arrays & Hashing" (unordered)
  makePrivate: true,
  delayMs:    400,           // between API calls
  maxRetries: 2,             // per failed call
};

const REQUIRED_PAGE = "https://leetcode.com/problemset/";
const ENDPOINT      = "https://leetcode.com/graphql/";

// ---------------------------------------------------------------------------
// The data. NeetCode roadmap order - earlier categories are prerequisites.
// ---------------------------------------------------------------------------

const NEETCODE_150 = {
  "Arrays & Hashing": [
    "contains-duplicate",
    "valid-anagram",
    "two-sum",
    "group-anagrams",
    "top-k-frequent-elements",
    "encode-and-decode-strings",
    "product-of-array-except-self",
    "valid-sudoku",
    "longest-consecutive-sequence"
  ],
  "Two Pointers": [
    "valid-palindrome",
    "two-sum-ii-input-array-is-sorted",
    "3sum",
    "container-with-most-water",
    "trapping-rain-water"
  ],
  "Sliding Window": [
    "best-time-to-buy-and-sell-stock",
    "longest-substring-without-repeating-characters",
    "longest-repeating-character-replacement",
    "permutation-in-string",
    "minimum-window-substring",
    "sliding-window-maximum"
  ],
  "Stack": [
    "valid-parentheses",
    "min-stack",
    "evaluate-reverse-polish-notation",
    "daily-temperatures",
    "car-fleet",
    "largest-rectangle-in-histogram"
  ],
  "Binary Search": [
    "binary-search",
    "search-a-2d-matrix",
    "koko-eating-bananas",
    "find-minimum-in-rotated-sorted-array",
    "search-in-rotated-sorted-array",
    "time-based-key-value-store",
    "median-of-two-sorted-arrays"
  ],
  "Linked List": [
    "reverse-linked-list",
    "merge-two-sorted-lists",
    "linked-list-cycle",
    "reorder-list",
    "remove-nth-node-from-end-of-list",
    "copy-list-with-random-pointer",
    "add-two-numbers",
    "find-the-duplicate-number",
    "lru-cache",
    "merge-k-sorted-lists",
    "reverse-nodes-in-k-group"
  ],
  "Trees": [
    "invert-binary-tree",
    "maximum-depth-of-binary-tree",
    "diameter-of-binary-tree",
    "balanced-binary-tree",
    "same-tree",
    "subtree-of-another-tree",
    "lowest-common-ancestor-of-a-binary-search-tree",
    "binary-tree-level-order-traversal",
    "binary-tree-right-side-view",
    "count-good-nodes-in-binary-tree",
    "validate-binary-search-tree",
    "kth-smallest-element-in-a-bst",
    "construct-binary-tree-from-preorder-and-inorder-traversal",
    "binary-tree-maximum-path-sum",
    "serialize-and-deserialize-binary-tree"
  ],
  "Heap / Priority Queue": [
    "kth-largest-element-in-a-stream",
    "last-stone-weight",
    "k-closest-points-to-origin",
    "kth-largest-element-in-an-array",
    "task-scheduler",
    "design-twitter",
    "find-median-from-data-stream"
  ],
  "Backtracking": [
    "subsets",
    "combination-sum",
    "combination-sum-ii",
    "permutations",
    "subsets-ii",
    "generate-parentheses",
    "word-search",
    "palindrome-partitioning",
    "letter-combinations-of-a-phone-number",
    "n-queens"
  ],
  "Tries": [
    "implement-trie-prefix-tree",
    "design-add-and-search-words-data-structure",
    "word-search-ii"
  ],
  "Graphs": [
    "number-of-islands",
    "max-area-of-island",
    "clone-graph",
    "walls-and-gates",
    "rotting-oranges",
    "pacific-atlantic-water-flow",
    "surrounded-regions",
    "course-schedule",
    "course-schedule-ii",
    "graph-valid-tree",
    "number-of-connected-components-in-an-undirected-graph",
    "redundant-connection",
    "word-ladder"
  ],
  "Advanced Graphs": [
    "network-delay-time",
    "reconstruct-itinerary",
    "min-cost-to-connect-all-points",
    "swim-in-rising-water",
    "alien-dictionary",
    "cheapest-flights-within-k-stops"
  ],
  "1-D Dynamic Programming": [
    "climbing-stairs",
    "min-cost-climbing-stairs",
    "house-robber",
    "house-robber-ii",
    "longest-palindromic-substring",
    "palindromic-substrings",
    "decode-ways",
    "coin-change",
    "maximum-product-subarray",
    "word-break",
    "longest-increasing-subsequence",
    "partition-equal-subset-sum"
  ],
  "2-D Dynamic Programming": [
    "unique-paths",
    "longest-common-subsequence",
    "best-time-to-buy-and-sell-stock-with-cooldown",
    "coin-change-ii",
    "target-sum",
    "interleaving-string",
    "longest-increasing-path-in-a-matrix",
    "distinct-subsequences",
    "edit-distance",
    "burst-balloons",
    "regular-expression-matching"
  ],
  "Greedy": [
    "maximum-subarray",
    "jump-game",
    "jump-game-ii",
    "gas-station",
    "hand-of-straights",
    "merge-triplets-to-form-target-triplet",
    "partition-labels",
    "valid-parenthesis-string"
  ],
  "Intervals": [
    "insert-interval",
    "merge-intervals",
    "non-overlapping-intervals",
    "meeting-rooms",
    "meeting-rooms-ii",
    "minimum-interval-to-include-each-query"
  ],
  "Math & Geometry": [
    "rotate-image",
    "spiral-matrix",
    "set-matrix-zeroes",
    "happy-number",
    "plus-one",
    "powx-n",
    "multiply-strings",
    "detect-squares"
  ],
  "Bit Manipulation": [
    "single-number",
    "number-of-1-bits",
    "counting-bits",
    "reverse-bits",
    "missing-number",
    "sum-of-two-integers",
    "reverse-integer"
  ]
};

// ---------------------------------------------------------------------------
// Schema, confirmed empirically. Notes on the traps:
//   - list identifier is "slug"; "idHash" was removed
//   - createEmptyFavorite needs favoriteType: NORMAL (an enum)
//   - updateFavoriteNameDescriptionV2 declares "description" OPTIONAL but the
//     server resolver CRASHES without it. Always send it.
//   - a 200 can still be a failure: check errors[] and a null payload too
// ---------------------------------------------------------------------------

const Q = {
  lists: `query { myCreatedFavoriteList {
            favorites { slug name questionNumber isPublicFavorite } } }`,

  create: `mutation ($favoriteType: FavoriteTypeEnum!, $name: String!) {
             createEmptyFavorite(favoriteType: $favoriteType, name: $name) { ok error } }`,

  add: `mutation ($favoriteSlug: String!, $questionSlugs: [String]!) {
          batchAddQuestionsToFavorite(favoriteSlug: $favoriteSlug,
                                      questionSlugs: $questionSlugs) { ok error } }`,

  rename: `mutation ($favoriteSlug: String!, $name: String!, $description: String) {
             updateFavoriteNameDescriptionV2(favoriteSlug: $favoriteSlug, name: $name,
                                             description: $description) { ok error } }`,

  visibility: `mutation ($favoriteSlug: String!, $isPublic: Boolean!) {
                 updateFavoriteIsPublicV2(favoriteSlug: $favoriteSlug,
                                          isPublic: $isPublic) { ok error } }`,
};

// ---------------------------------------------------------------------------
// Plumbing
// ---------------------------------------------------------------------------

function assertPage() {
  const here = location.origin + location.pathname;
  if (here !== REQUIRED_PAGE && here !== REQUIRED_PAGE.slice(0, -1))
    throw new Error(`Wrong page. Run only on ${REQUIRED_PAGE}\nYou are on: ${here}`);
}

const csrf  = () => (document.cookie.match(/csrftoken=([^;]+)/) || [])[1];
const sleep = (ms = CONFIG.delayMs) => new Promise(r => setTimeout(r, ms));

// Every failure mode this session produced, checked in one place.
async function gql(query, variables = {}, label = "") {
  assertPage();
  let lastErr = "";
  for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
    if (attempt) await sleep(CONFIG.delayMs * (attempt + 1));   // backoff
    let res, body;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json", "x-csrftoken": csrf() || "" },
        body: JSON.stringify({ query, variables }),
      });
    } catch (e) { lastErr = "network: " + e.message; continue; }

    try { body = await res.json(); } catch { body = null; }

    if (res.status === 429) { lastErr = "rate limited"; await sleep(3000); continue; }
    if (body?.errors?.length) { lastErr = body.errors.map(e => e.message).join(" | "); continue; }
    if (res.status !== 200)   { lastErr = `HTTP ${res.status}`; continue; }
    if (!body?.data)          { lastErr = "empty response"; continue; }

    // Soft failure: 200 with a null payload, or ok:false inside it.
    const payload = body.data[Object.keys(body.data)[0]];
    if (payload === null)      { lastErr = "null payload (server resolver threw)"; continue; }
    if (payload && payload.ok === false) {
      lastErr = payload.error || "ok:false";
      continue;
    }
    return body.data;
  }
  throw new Error(`${label || "call"} failed: ${lastErr}`);
}

const getLists = async () =>
  (await gql(Q.lists, {}, "list query")).myCreatedFavoriteList.favorites;

const listName = (cat, i) => CONFIG.numbered
  ? `${CONFIG.namePrefix} ${String(i + 1).padStart(2, "0")} \u00b7 ${cat}`
  : `${CONFIG.namePrefix} \u00b7 ${cat}`;

// Match either the numbered or unnumbered form, so re-runs and older runs
// both resolve to the same list instead of creating duplicates.
function findList(lists, cat, i) {
  const numbered   = `${CONFIG.namePrefix} ${String(i + 1).padStart(2, "0")} \u00b7 ${cat}`;
  const unnumbered = `${CONFIG.namePrefix} \u00b7 ${cat}`;
  return lists.find(f => f.name === numbered) || lists.find(f => f.name === unnumbered);
}

// ---------------------------------------------------------------------------
// Plan (read-only)
// ---------------------------------------------------------------------------

async function ncPlan() {
  try { assertPage(); } catch (e) { console.error(e.message); return false; }
  if (!csrf()) { console.error("Not logged in (no csrftoken cookie)."); return false; }

  const cats = Object.keys(NEETCODE_150);
  const total = cats.reduce((n, c) => n + NEETCODE_150[c].length, 0);
  const lists = await getLists();

  let create = 0, reuse = 0, rename = 0;
  const rows = cats.map((cat, i) => {
    const want = listName(cat, i);
    const hit  = findList(lists, cat, i);
    if (!hit) create++; else { reuse++; if (hit.name !== want) rename++; }
    return { list: want, status: !hit ? "create" : (hit.name !== want ? "rename+fill" : "fill"),
             problems: NEETCODE_150[cat].length };
  });

  console.log("%cPlan - nothing written yet", "font-weight:bold;font-size:13px");
  console.table(rows);
  console.log(`  ${cats.length} categories, ${total} problems`);
  console.log(`  create ${create} / reuse ${reuse} (${rename} need renaming)`);
  console.log(`  existing lists on account: ${lists.length}`);
  console.log("%c  Ready. Run: ncRun()", "color:green;font-weight:bold");
  return true;
}

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

async function ncRun() {
  try { assertPage(); } catch (e) { console.error(e.message); return; }

  const cats = Object.keys(NEETCODE_150);
  const report = [];

  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i], want = listName(cat, i), slugs = NEETCODE_150[cat];
    const row = { list: want, action: "", added: 0, of: slugs.length, private: "", note: "" };

    try {
      let lists = await getLists();
      let hit = findList(lists, cat, i);

      // create if absent, then confirm by re-reading
      if (!hit) {
        await gql(Q.create, { favoriteType: "NORMAL", name: want }, "create");
        await sleep();
        hit = findList(await getLists(), cat, i);
        if (!hit) throw new Error("created but not found on re-query");
        row.action = "created";
      } else {
        row.action = "reused";
      }

      // rename if the name drifted (e.g. numbering added later)
      if (hit.name !== want) {
        await gql(Q.rename,
          { favoriteSlug: hit.slug, name: want, description: "" }, "rename");
        await sleep();
        row.action += "+renamed";
      }

      // add problems - LeetCode dedupes, so re-adding is harmless
      await gql(Q.add, { favoriteSlug: hit.slug, questionSlugs: slugs }, "add");
      await sleep();

      if (CONFIG.makePrivate) {
        await gql(Q.visibility, { favoriteSlug: hit.slug, isPublic: false }, "visibility");
        await sleep();
      }

      // verify against the server, don't trust the mutation replies
      const after = (await getLists()).find(f => f.slug === hit.slug);
      row.added   = after?.questionNumber ?? 0;
      row.private = after?.isPublicFavorite === false ? "yes" : "no";
      if (row.added < slugs.length) row.note = "fewer than expected";
      console.log(`  ${after?.name}: ${row.added}/${slugs.length}`);
    } catch (e) {
      row.action = "ERROR";
      row.note = e.message;
      console.warn(`  ${want}: ${e.message}`);
      if (i === 0) {
        console.error("First category failed - stopping rather than repeating it 17x.");
        console.table([row]);
        return [row];
      }
    }
    report.push(row);
    await sleep();
  }

  const bad = report.filter(r => r.action === "ERROR" || r.added < r.of);
  console.log(`%cDone. ${report.length - bad.length}/${report.length} clean.`,
              "font-weight:bold");
  console.table(report);
  if (bad.length) console.warn("Re-run to retry the incomplete ones - it is safe.");
  return report;
}

// Read-only audit of current state.
async function ncVerify() {
  const lists = await getLists();
  const cats  = Object.keys(NEETCODE_150);
  const rows = cats.map((cat, i) => {
    const hit = findList(lists, cat, i);
    return { expected: listName(cat, i), found: hit?.name ?? "MISSING",
             problems: hit ? `${hit.questionNumber}/${NEETCODE_150[cat].length}` : "-",
             private: hit ? hit.isPublicFavorite === false : "-" };
  });
  console.table(rows);
  const ok = rows.every(r => r.found !== "MISSING" && r.private === true &&
                             r.problems.split("/")[0] === r.problems.split("/")[1]);
  console.log(ok ? "%cAll good." : "%cSome drift - re-run ncRun().",
              ok ? "color:green;font-weight:bold" : "color:orange;font-weight:bold");
  return rows;
}

try {
  assertPage();
  Object.assign(window, { ncRun, ncPlan, ncVerify, NEETCODE_150, CONFIG });
  ncPlan();
} catch (e) {
  console.error(e.message);
  console.error("Nothing installed.");
}
