# Orion Light Attempt #2 - Detailed Violation Analysis

## Overall Grade: 3/10 - REJECT

This attempt is **worse** than the first one. The AI is now actively ignoring the encyclopedia ban and using low-quality sources.

## Critical Violations

### 1. Encyclopaedia Britannica (EXPLICITLY FORBIDDEN)

```json
{
  "title": "Hermes Trismegistus",
  "author": "Encyclopaedia Britannica",
  "edition": "2022 Edition",
  "year": 2022,
  "url": "https://www.britannica.com/topic/Hermes-Trismegistos-Egyptian-god"
}
```

**Violation:** Britannica.com is explicitly listed in the forbidden sites section
**Severity:** CRITICAL - This is exactly what we're trying to prevent
**Fix:** Use Manly P. Hall's "Secret Teachings of All Ages" or Hermetic Corpus translations instead

### 2. Theosophy Trust Website Article (NOT A PUBLISHED BOOK)

```json
{
  "title": "Hermes Trismegistus",
  "author": "Theosophy Trust",
  "edition": "2024 Edition",
  "year": 2024,
  "url": "https://theosophytrust.org/276-hermes-trismegistus"
}
```

**Violation:** Website article, not a published book with ISBN
**Severity:** HIGH - No verifiable publication
**Fix:** Use Alice Bailey's published books or Blavatsky's "Secret Doctrine" with ISBNs

### 3. Fake/Anonymous Author "Ancient Tradition Documentation"

```json
{
  "title": "Thoth Mystery School",
  "author": "Ancient Tradition Documentation",
  "edition": "Contemporary",
  "year": 2024,
  "url": "https://cdn.preterhuman.net/texts/other/crystalinks/thothms.html"
}
```

**Violation:** Made-up author name, personal website (crystalinks)
**Severity:** CRITICAL - Fabricated source
**Fix:** Use "The Kybalion" or Hermetic Corpus with proper attribution

### 4. WordPress Blog (peacefulawakenings.wordpress.com)

```json
{
  "title": "The Ancient Egyptian Pyramid Texts",
  "author": "James P. Allen",
  "url": "https://peacefulawakenings.wordpress.com/2012/08/12/wag-festival/"
}
```

**Violation:** WordPress blog, not the actual book
**Severity:** HIGH - Blog post citing the book, not the book itself
**Fix:** Use archive.org scan of Allen's actual book or publisher website

### 5. Personal Tripod Site (platopagan.tripod.com)

```json
{
  "title": "The Golden Ass (Metamorphoses)",
  "author": "Apuleius",
  "url": "https://platopagan.tripod.com/apuleius.htm"
}
```

**Violation:** Personal Tripod website from the 1990s
**Severity:** HIGH - Not a reliable source
**Fix:** Use Penguin Classics edition on archive.org or publisher site

### 6. Goodreads (Book Review Site, Not Primary Source)

```json
{
  "title": "The Secret Teachings of All Ages",
  "author": "Manly Palmer Hall",
  "url": "https://www.goodreads.com/book/show/183683..."
}
```

**Violation:** Goodreads is a book review aggregator, not a publisher
**Severity:** MEDIUM - Should use sacred-texts.com or publisher site instead
**Fix:** https://sacred-texts.com/eso/sta/ or https://www.prs.org/

### 7. Wrong Attribution for Ancient Text

```json
{
  "title": "Book of Breathings",
  "author": "Ancient Egyptian Text",
  "translator_or_editor": "Multiple translators",
  "url": "https://www.pseudepigrapha.com/egyptian/BookOfBreathings.htm"
}
```

**Violation:** "Ancient Egyptian Text" is not an author, "Multiple translators" is not acceptable
**Severity:** MEDIUM - Lazy attribution
**Fix:** Find specific translation with named translator

## What Went Wrong

The AI is taking shortcuts and grabbing whatever appears in search results instead of:

1. Going to **archive.org** for actual book scans
2. Using **sacred-texts.com** for proper ancient text translations
3. Finding **publisher websites** with ISBNs
4. Accessing **academic databases** for papers

## Pattern Analysis

**First attempt:** 1 violation (Encyclopedia.com) - otherwise good sources
**Second attempt:** 7+ violations - multiple forbidden domains

**Conclusion:** The AI is getting lazier, not more careful. The additional guidance about "inference and synthesis" may have been interpreted as "lower your standards."

## What Needs to Happen

### Immediate Fixes to Prompt:

1. ✅ Added explicit URL domain check section
2. ✅ Listed forbidden domains with examples (britannica.com, wordpress.com, tripod.com, etc.)
3. ✅ Added "FINAL PRE-SUBMISSION URL CHECK" section
4. ✅ Listed acceptable domains (archive.org, sacred-texts.com, publisher sites, .edu)

### Next Attempt Should:

1. Use **archive.org** for book scans (Faulkner Pyramid Texts, Allen translations)
2. Use **sacred-texts.com** for Hermetic Corpus, Kybalion, Manly P. Hall
3. Use **publisher sites** for modern books (Bauval, etc.)
4. Use **academic databases** for papers
5. **Manually check every URL** before submitting

## Acceptable Sources for Each Characteristic

### "Record keepers and historians"
✅ Pyramid Texts (Faulkner) - archive.org or sacred-texts.com
✅ Hermetic Corpus (Mead translation) - sacred-texts.com
✅ Manly P. Hall "Secret Teachings" - sacred-texts.com or prs.org
❌ Britannica.com
❌ Theosophy Trust website
❌ Crystalinks personal site

### "Spiritual rebirth and resurrection"
✅ Pyramid Texts (Allen or Faulkner) - archive.org
✅ Book of the Dead (Faulkner) - archive.org or publisher
✅ Coffin Texts (Faulkner) - archive.org
❌ WordPress blogs
❌ Personal websites

### "Mystery school initiators"
✅ Plutarch "Isis and Osiris" - archive.org or Loeb Classical Library
✅ Iamblichus "On the Mysteries" - archive.org or academic press
✅ Apuleius "Golden Ass" - archive.org or Penguin Classics site
❌ Tripod personal sites
❌ Goodreads

## Recommendation

**Re-run with V3 prompt** (now includes explicit URL domain checks). The AI needs to understand that:

1. **Source quality is non-negotiable** - No encyclopedias, blogs, or personal sites
2. **Inference is acceptable** - But only with verified sources
3. **URL domains matter** - Britannica.com is just as forbidden as Encyclopedia.com

The prompt now has a "FINAL PRE-SUBMISSION URL CHECK" section that explicitly tells the AI to scan every URL and delete any forbidden domains before submitting.
