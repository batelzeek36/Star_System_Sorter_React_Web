
# S³ DATA HARVEST PROMPT (FOR CLAUDE)

## SYSTEM ROLE
You are acting as the Data Harvester and Structurer for the S³ (Star System Sorter) project.

Your job is to:
1. Pull Human Design gate.line data for ALL 64 gates, lines 1–6, from the Bodygraph API.
2. Save an internal "verbatim snapshot" file for provenance.
3. Generate an app-safe paraphrased traits file in my voice.
4. Output both files as valid JSON.

We are building an attribution-safe star system classifier. Accuracy and consistency are critical.

**DO NOT ASK ME FOLLOW-UP QUESTIONS. MAKE YOUR BEST ASSUMPTIONS AND MOVE.**


---

## CONTEXT / WHY THIS MATTERS
S³ maps a person's Human Design chart to 8 star systems (Pleiades, Arcturus, Lyra, Sirius, Andromeda, Orion Light, Orion Dark, Draco). To do that, we:
- Read which gate.lines are active in their chart.
- Match each gate.line to thematic traits.
- Translate those traits into weighted alignment across the 8 star systems.

This prompt collects the raw gate.line source material so we can build that mapping.

We are building THREE data layers:
- (A) `gateLine_raw_source.json` → **PRIVATE, NEVER SHOWN TO USERS.**
- (B) `gateLine_traits_clean.json` → **PUBLIC-SAFE, SHIPPABLE.**
- (C) `gateLine_star_map.json` → **OUR IP (we'll do this later manually).**

You are responsible right now for (A) and (B).

Do not generate (C) in this task.


---

## WHAT TO QUERY
You must iterate over:
- gates: **1 through 64** (integers)
- lines: **1 through 6** (integers)

For each (gate, line) pair, call the Bodygraph API.

**ASSUME the request looks like this (adapt if needed to match the API’s real schema):**

**REQUEST (example for Gate 54, Line 3):**
```http
GET https://BODYGRAPH_API_BASE_URL/v1/gates/54/lines/3
Headers:
  Authorization: Bearer BODYGRAPH_API_KEY
  Accept: application/json
````

If the Bodygraph API uses a different path (e.g. `/gate/54/line/3` or `/gates/54?line=3`), adapt accordingly.
Your job is to successfully retrieve the data, not to stick to this exact path.

If rate limited, you MUST retry with a short delay.

---

## WHAT FIELDS TO CAPTURE

The Bodygraph API may return fields like:

* `gate_number`
* `line_number`
* `name` / `title`
* `keynote` / `theme`
* `description` / `lesson` / `purpose`
* `shadow` / `challenge` / `distortion`
* `gift` / `higher expression`
* `circuitry` / `circuit` / `role` (tribal, individual, collective)
* `mechanics` info (`projected`, `generated`, etc.)

Not all APIs use the same names.
**Your job:**

* Extract what matches these ideas even if the field names differ.
* If something doesn't exist, use `null`.

You MUST build ONE canonical normalized object per gate.line with the following keys:

```json
{
  "gate": <int>,                         // e.g. 54
  "line": <int>,                         // e.g. 3
  "gate_line_key": "<gate>.<line>",      // e.g. "54.3"
  "official_name": "<string or null>",   // e.g. "Ambition / Drive Line 3"
  "raw_description": "<string or null>", // VERBATIM from API, full text, no paraphrase
  "shadow_description": "<string or null>", // VERBATIM if API exposes shadow/challenge/fear/etc.
  "gift_description": "<string or null>",   // VERBATIM if API exposes gift/higher expression/etc.
  "mechanics_role": "<string or null>",  // e.g. "tribal support", "individual mutation", "collective sharing", "projected awareness", etc.
  "circuit": "<string or null>",         // if API exposes circuitry or grouping
  "source_provider": "Bodygraph API",
  "citation_status": "provisional",
  "location_hint": "<string>",
  "captured_at_utc": "<ISO8601 timestamp>"
}
```

Rules:

* `location_hint` must tell me exactly where you pulled it from (endpoint path you hit).
* `captured_at_utc` must be the actual timestamp you are doing this work in UTC.
* Do NOT paraphrase in `raw_description` / `shadow_description` / `gift_description`. Copy verbatim from the API. This is our internal receipts file.
* Escape newlines as `\n` so that the final JSON is valid.

If the API separates "theme", "purpose", "essence", etc., append that text to `raw_description`, one after another, clearly labeled inside square brackets. Example:

```text
"[THEME] …text… [PURPOSE] …text… [ESSENCE] …text…"
```

We want ALL relevant official descriptive language inside `raw_description`. Do NOT drop anything important.

---

## OUTPUT FILE (A): `gateLine_raw_source.json`

At the end, you MUST construct a single JSON object with **384 entries** (64 gates × 6 lines).
The top-level shape MUST be:

```json
{
  "1.1": { ...normalized object for gate 1 line 1... },
  "1.2": { ... },
  "1.3": { ... },
  ...
  "64.6": { ... }
}
```

* Keys MUST be the string `"<gate>.<line>"`.
* Call that entire object `gateLine_raw_source.json`.
* This file is **PRIVATE**. It includes verbatim API language and therefore MUST NOT be used directly in the user-facing app.

---

## OUTPUT FILE (B): `gateLine_traits_clean.json`

Now generate a SECOND object with the exact same 384 keys (`"1.1"`, `"1.2"`, ..., `"64.6"`), but in a SAFE paraphrased format we *can* ship publicly.

For each gate.line, create:

```json
{
  "keywords": [ "...", "...", "..." ],
  "behavioral_axis": "...",
  "shadow_axis": "..."
}
```

**Definitions:**

* `keywords`:

  * 3–6 short phrases (2–5 words each) that describe how this gate.line tends to act in real life.
  * These MUST be fresh, original wording.
  * Do NOT copy any full sentences or exact phrasing from the API.
  * Good example:

    * `["ambition under trial", "earning rank through pressure", "loyalty to higher code"]`
  * Bad example (DON'T DO):

    * `"This line is here to..."` (this mimics Ra Uru Hu voice; we want new language)

* `behavioral_axis`:

  * One concise sentence fragment (not a full paragraph) that explains the constructive / gift side of this line's behavior.
  * Keep it under 20 words.
  * Neutral, tactical tone.

* `shadow_axis`:

  * One concise sentence fragment that names the distortion / fear / control pattern when this line is off.
  * Keep it under 20 words.
  * Call out paranoia, hunger, collapse, people-pleasing, ego inflation, etc. in plain language.

Important:

* **NO verbatim copying from the API here.** This is 100% our language.
* **DO NOT mention star systems yet** (Pleiades, Draco, etc.). We'll map that later in a third file.
* If you can infer role style (e.g. "tribal protector", "mutation catalyst", "pattern analyst for the group"), bake that into `keywords` / `behavioral_axis`. That's allowed.
* If you’re unsure about the meaning, infer logically from any field of the raw response. Make your best call. Do not leave it blank.

Final shape for the second file:

```json
{
  "1.1": {
    "keywords": [...],
    "behavioral_axis": "...",
    "shadow_axis": "..."
  },
  "1.2": { ... },
  ...
  "64.6": { ... }
}
```

Call that entire object `gateLine_traits_clean.json`.

This is the version that is safe to ship publicly and safe to display in the app.

---

## EXAMPLE (ILLUSTRATIVE ONLY — NOT REAL DATA)

IMPORTANT: These are EXAMPLES so you understand formatting. You must overwrite with actual API data.

**Example raw_source entry for Gate 54 Line 3:**

```json
"54.3": {
  "gate": 54,
  "line": 3,
  "gate_line_key": "54.3",
  "official_name": "Ambition Line 3",
  "raw_description": "[THEME] Drives to rise in status by forming strategic bonds. [PURPOSE] Navigates power structures under pressure. [ESSENCE] Uses trial-by-fire experiences to climb.\nAdditional notes: This line tests integrity in the pursuit of elevation.",
  "shadow_description": "Can become obsessed with rank or transactional loyalty.",
  "gift_description": "Channels ambition into service to something larger than self; inspires collective uplift.",
  "mechanics_role": "tribal support / material ascent",
  "circuit": "Tribal (Ego/Will)",
  "source_provider": "Bodygraph API",
  "citation_status": "provisional",
  "location_hint": "GET /v1/gates/54/lines/3",
  "captured_at_utc": "2025-10-27T00:00:00Z"
}
```

**Example traits_clean entry for Gate 54 Line 3:**

```json
"54.3": {
  "keywords": [
    "ambition under pressure",
    "oath to the mission",
    "proving worth through trials"
  ],
  "behavioral_axis": "Climbs in rank by enduring tests without selling out core values.",
  "shadow_axis": "Status hunger, transactional loyalty, chasing power for its own sake."
}
```

---

## VALIDATION REQUIREMENTS

1. Every string in both output objects must be valid JSON (escape quotes, escape newlines with `\\n`).
2. Every gate.line from `"1.1"` through `"64.6"` MUST exist in BOTH files.
3. `gateLine_raw_source.json` and `gateLine_traits_clean.json` MUST share the exact same set of keys.
4. **Do NOT include any commentary, markdown, prose, or explanation outside the JSON objects.**
   Only output the two JSON objects.
   First output `gateLine_raw_source.json`, then a newline, then output `gateLine_traits_clean.json`.
5. In `gateLine_traits_clean.json`, DO NOT include any private API text. Everything must be original phrasing.
6. If a field in `gateLine_raw_source.json` is missing (API doesn't give that info), set it to `null` (NOT an empty string).

---

## RATE LIMIT / FAILURE RULE

* If an API call fails, retry it.
* If it still fails, create the entry anyway with:

  * `official_name`: null
  * `raw_description`: null
  * `shadow_description`: null
  * `gift_description`: null
  * `mechanics_role`: null
  * `circuit`: null
  * BUT STILL fill `gate`, `line`, `gate_line_key`, `source_provider`, `citation_status`, `location_hint`, `captured_at_utc`.
* Then continue. Do NOT abort the entire run.

---

## FINAL TASK

1. Loop all 64 gates × 6 lines.
2. Harvest raw data using the Bodygraph API and normalize it into `gateLine_raw_source.json`.
3. For each gate.line, generate a clean paraphrased block and build `gateLine_traits_clean.json`.
4. Output BOTH final JSON objects (**A then B**) as your response.
   **NOTHING ELSE.**

**BEGIN NOW.**
