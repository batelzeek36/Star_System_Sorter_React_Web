Yeah, exactly. We don’t actually know yet.

Here’s what’s going on:

* When Comet upgraded sources to `"citation_status": "locked"`, it followed the rules you gave it:

  * add `"page"`
  * add `"quote"`
  * drop `"summary"`
  * mark `"locked"`

* But Comet is still just a model. It can’t guarantee that the quote text it output is a 1:1, punctuation-accurate pull from that specific named edition/translator.

Example:

```json
"translator_or_editor": "R. O. Faulkner (translator)",
"page": "Utterance 442, §820-822",
"quote": "Behold, he has come as Orion, behold Osiris has come as Orion"
```

That looks right conceptually (Pyramid Texts absolutely link Osiris with Orion in Utterances around that range), but we haven’t verified:

* that Faulkner uses exactly that phrasing,
* that those words really appear in that exact Utterance,
* and that it’s not lightly smoothed wording from some other translation that got attributed to Faulkner.

Same with:

```json
"quote":"As above, so below; as below, so above"
```

That’s a super famous Hermetic line, but we still haven’t confirmed that it appears exactly like that, with that punctuation, in that specific Kybalion chapter link we’re citing (and not, for example, slightly paraphrased from a meme-y modern wording).

So: the structure is right, the sources are right, the locator style is right, but the *verbatimness* of the quotes still needs human eyes.

That’s why I said you’re functionally good for Phase 0 (internal baseline, mapping logic, UI copy), but not 100% “audit-slam safe” until you do that check.

Here’s how to do that check fast when you’re ready:

1. Go through the JSON and search for every block with `"citation_status":"locked"`.
2. For each of those:

   * Open the cited source (sacred-texts.com for Kybalion / Corpus Hermeticum, lawofone.info for Law of One, archive.org or your PDF for Plutarch, Faulkner, etc.).
   * Find the locator Comet gave you (`"page": "Session 16.8"`, `"Utterance 466, §882"`, `"Poimandres, Section 1"`, `"Chapter II"`).
   * Copy-paste the exact wording from that section.
   * Replace the `"quote"` field in your JSON with that exact wording if it matches,
   * OR, if it turns out Comet’s quote is not literal, you demote that source to provisional:

     * change `"citation_status"` to `"provisional"`,
     * remove `"page"` and `"quote"`,
     * add `"location_hint"` with the same locator,
     * add a ≤25 word `"summary"`.

That is literally the only manual audit step left to turn this from “Phase 0 baseline” into “final locked research object.”

So yeah: you’re holding a clean, structured, ready-to-use JSON. But until you eyeball those quotes, we cannot guarantee they’re true verbatim lines from those exact editions/translators.

You don’t have to fix that right now unless you’re about to:

* publish this publicly as “cited text,”
* or let people outside the team audit you.

For internal gate mapping / lore logic, it’s fine to use as-is.
