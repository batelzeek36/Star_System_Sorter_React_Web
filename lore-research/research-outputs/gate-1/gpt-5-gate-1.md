Here’s a fast QC pass on your three Gate 1 files.

**Verdict (TL;DR):**

- **Pass A — Canonical HD/GK/I Ching:** ✅ **Good to ingest now.** Structure matches, quotes ≤25w, fields present. Consider tighter page/section refs later.
    
- **Pass B — Ancient Parallels:** ✅ **Good (with a few source upgrades).** Solid cross-tradition spread; some links are secondary web copies—fine for MVP, but flag a few for later replacement.
    
- **Pass C — Star Alignments:** 🟨 **Usable after small fixes.** Structure is right and the picks make sense, but sources/flags need tightening; also missing `weights_hint`.
    

---

# What to fix (quick)

## Pass A (Gate 1 core) — **optional polish**

- Add exact **page/section** when you can for Ra/GK (you have section labels already).
    
- Keep translator/edition years consistent with Pass B’s I Ching citation (your A=1950, B=1967; either is fine—just be consistent).
    

## Pass B (ancient parallels) — **nice-to-have upgrades**

- **Hopi**: current link is a blog summary; later swap for a more primary ethnography/anthropology citation (keep this for now).
    
- **Orphic Hymns / Timaeus**: good calls; you already include Stephanus pagination—👍. If time allows, add a page/line note or a critical edition link.
    

## Pass C (star alignments) — **must-fix before ingest**

1. **Mark disputes & source quality clearly (Sirius/Dogon, etc.)**
    
    - Your Sirius entry cites Temple/Dogon ideas but doesn’t mark them as disputed. Flip `disputed` to `true` for those lines and/or add a `disputed_points` note.
        
2. **Replace weak citations with book/primary where possible:**
    
    - Sirius/Temple → use the book (any edition) rather than a blog page.
        
    - Pleiades/Marciniak → cite the **book** page(s) instead of Goodreads/quote compilations.
        
    - Lyra/**Prism of Lyra** → cite the book/official PDF (not a general “research compilation” link).
        
3. **Confidence levels:**
    
    - **Andromeda = “high”** is too strong with current web articles; drop to **medium** unless you add contactee/primary channeled sources (e.g., Collier’s book/interview transcripts).
        
4. **Add `weights_hint` (required by your SOP):**
    
    - Include a small vector totaling ≤15 per Gate, e.g.
        
        ```json
        "weights_hint":[
          {"system_id":"lyra","suggested_w":5,"reason":"primordial creative source"},
          {"system_id":"pleiades","suggested_w":4,"reason":"creative/nurturing emission"},
          {"system_id":"sirius","suggested_w":3,"reason":"initiatory self-consciousness"},
          {"system_id":"andromeda","suggested_w":3,"reason":"sovereign creative freedom"}
        ]
        ```
        
5. **Coverage:**
    
    - Consider adding **Orion Light/Osirian** with **low/medium** confidence (Egyptian creative-rebirth/royal order theme) to round out 3–5 alignments.
        

---

# Ready/Not-Ready summary

- **Pass A:** **READY** to feed Claude → YAML rules (confidence 2–3).
    
- **Pass B:** **READY** (flag Hopi/Tao Te Ching for later primary upgrades).
    
- **Pass C:** **HOLD for 10-minute patch** (add `weights_hint`, mark disputed, upgrade 2–3 citations, rebalance confidences). After that, it’s good to ingest.