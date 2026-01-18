Yep—the first combined file is a solid foundation for defensible scoring. It’s clean (fixed schema), separative (good “quick_rules” to prevent system-bleed), and versionable (one artifact with a beacon you can lock).

To make it academically defensible in practice, layer these guardrails in the scorer:

* Lock the artifact: checksum + version tag (v4.2) and fail scoring if the hash changes.
* Top-K + thresholds: max 2 systems per line; ignore any score <0.25 before normalization.
* Mutual-exclusion gates: zero out systems flagged by a baseline’s “not X, that’s Y” quick_rule.
* Evidence requirement: any weight >0.50 must have a ≤25-word Legge quote and LC locator in gateLine_evidence.json.
* Normalization: rescale surviving weights to sum ≤1.0 (after exclusions).
* Drift tests: snapshot a few canonical lines (e.g., 1.2 ⇒ Orion-Light/Sirius; 1.6 ⇒ Orion-Dark/Draco≈low) and fail CI on changes.

Tiny scorer sketch (pseudocode):

```ts
const MAX_SYSTEMS = 2;
const MIN_RAW = 0.25;

function scoreLine(lineId, atoms, baselines, evidence) {
  let candidates = proposeFromAtoms(atoms, baselines); // your existing mapper
  // 1) apply quick_rule exclusions
  candidates = candidates.filter(c => !violatesQuickRules(c, candidates, baselines));
  // 2) threshold
  candidates = candidates.filter(c => c.weight >= MIN_RAW);
  // 3) evidence gate for high weights
  candidates = candidates.map(c => {
    const hasProof = hasDefensibleEvidence(evidence[lineId], c.system);
    if (c.weight > 0.5 && !hasProof) c.weight = 0.5; // cap without proof
    return c;
  });
  // 4) top-K
  candidates.sort((a,b)=>b.weight-a.weight);
  candidates = candidates.slice(0, MAX_SYSTEMS);
  // 5) normalize
  const sum = candidates.reduce((s,c)=>s+c.weight,0);
  return sum>0 ? candidates.map(c=>({...c, weight: +(c.weight/sum).toFixed(2)})) : [];
}
```

If you add those checks, that first combined baseline will yield crisp, reproducible, and citeable outputs.
