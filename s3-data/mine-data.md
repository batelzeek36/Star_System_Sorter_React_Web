Perfect. You’re at the fun-but-messy part 😅

You’ve basically got **raw ore** — now you need to smelt it into **gate/line JSON**.

Here’s a straight, no-theory pipeline you can run on your Mac.

---

## 0. What we’re assuming

* Your file is something like `Line Companion_djvu.txt`
* It has headings that look *roughly* like:

  * `Gate 10 – Behavior of the Self`
  * `Line 1: ...` or `1st line` or `Line 1 – ...`
    IA text can be weird, so we’ll make the regex a bit forgiving.

If your headings are really different, you’ll just tweak the regex section.

---

## 1. Normalize the text

Goal: kill weird line breaks and extra spaces so regex works.

```python
# normalize_line_companion.py
import re
from pathlib import Path

raw = Path("LineCompanion_djvu.txt").read_text(encoding="utf-8", errors="ignore")

# collapse Windows/Mac line endings
text = raw.replace("\r\n", "\n").replace("\r", "\n")

# get rid of long runs of blank lines
text = re.sub(r"\n{3,}", "\n\n", text)

Path("linecompanion_normalized.txt").write_text(text, encoding="utf-8")
```

Run:

```bash
python3 normalize_line_companion.py
```

---

## 2. Detect GATE blocks

We want to split into chunks like:
`Gate 1 ... (stuff)... Gate 2 ... (stuff)...`

```python
# split_gates.py
import re, json
from pathlib import Path

text = Path("linecompanion_normalized.txt").read_text(encoding="utf-8")

# this regex grabs headings like "Gate 10", "Gate 10:", "Gate 10 –"
gate_pattern = re.compile(r"(Gate\s+(\d{1,2})[^\n]*?)\n", re.IGNORECASE)

parts = []
last_idx = 0
matches = list(gate_pattern.finditer(text))

for i, m in enumerate(matches):
    gate_title = m.group(1).strip()
    gate_num = int(m.group(2))
    start = m.end()
    end = matches[i+1].start() if i + 1 < len(matches) else len(text)
    body = text[start:end].strip()
    parts.append({
        "gate": gate_num,
        "title": gate_title,
        "body": body
    })

Path("linecompanion_gates.json").write_text(json.dumps(parts, indent=2), encoding="utf-8")
print(f"wrote {len(parts)} gates")
```

This should give you ~64 objects if the text is clean.

---

## 3. Inside each Gate: find the Lines

Line Companion usually has 6 lines per gate. We’ll scan for:

* `Line 1`
* `Line 2`
* `1st line`
* `2nd line`
  to survive OCR weirdness.

```python
# split_lines_per_gate.py
import re, json
from pathlib import Path

gates = json.loads(Path("linecompanion_gates.json").read_text(encoding="utf-8"))

line_regex = re.compile(
    r"(Line\s+([1-6])(?:[^0-9\n]*)?)\n",  # "Line 1 ...\n"
    re.IGNORECASE
)

all_gate_lines = []

for g in gates:
    body = g["body"]
    matches = list(line_regex.finditer(body))
    if not matches:
        # gate with no lines detected – store whole thing
        all_gate_lines.append({
            "gate": g["gate"],
            "line": None,
            "heading": g["title"],
            "text": body
        })
        continue

    for i, m in enumerate(matches):
        line_num = int(m.group(2))
        start = m.end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(body)
        line_text = body[start:end].strip()
        all_gate_lines.append({
            "gate": g["gate"],
            "line": line_num,
            "heading": m.group(1).strip(),
            "text": line_text
        })

Path("linecompanion_gate_lines.json").write_text(
    json.dumps(all_gate_lines, indent=2),
    encoding="utf-8"
)
print(f"wrote {len(all_gate_lines)} gate/line entries")
```

Now you have a **flat list** like:

```json
{
  "gate": 10,
  "line": 3,
  "heading": "Line 3 – ...",
  "text": "long explanation from the companion..."
}
```

---

## 4. Trim to “< 25 words” snippets

This is the piece you wanted for your JSON `quotes: []`.

```python
# make_snippets.py
import json
from pathlib import Path

entries = json.loads(Path("linecompanion_gate_lines.json").read_text(encoding="utf-8"))

def first_n_words(s, n=25):
    words = s.split()
    return " ".join(words[:n])

by_gate = {}
for e in entries:
    gate = e["gate"]
    line = e["line"]
    # fallback text
    base = e["text"].strip()
    if not base:
        continue
    snippet = first_n_words(base, 25)
    by_gate.setdefault(gate, []).append({
        "line": line,
        "snippet": snippet
    })

Path("linecompanion_snippets_by_gate.json").write_text(
    json.dumps(by_gate, indent=2),
    encoding="utf-8"
)
```

That gives you:

```json
{
  "10": [
    {
      "line": 1,
      "snippet": "Behavior rooted in self-love becomes the basis for..."
    },
    {
      "line": 2,
      "snippet": "Here we meet the challenge of..."
    }
  ]
}
```

---

## 5. Merge into your HD JSON

Now you can grab a center/gate structure we just built (Ajna, Spleen, etc.) and **swap the placeholder quotes** with the real `snippet`s from this file.

Example merger logic:

```python
# merge_into_hd.py
import json
from pathlib import Path

snips = json.loads(Path("linecompanion_snippets_by_gate.json").read_text())
hd = json.loads(Path("my_hd_centers.json").read_text())  # your file

for center in hd["centers"]:
    for g in center.get("gates", []):
        gate_id = g["id"].split(".")[-1]  # "gate.10" -> "10"
        if gate_id.isdigit():
            gate_num = int(gate_id)
            if str(gate_num) in snips:
                # just take first snippet for now
                g["quotes"] = [s["snippet"] for s in snips[str(gate_num)]]

Path("my_hd_centers_enriched.json").write_text(json.dumps(hd, indent=2), encoding="utf-8")
```

(Adjust to your schema.)

---

## TL;DR for you

* You did the right thing grabbing `.txt`.
* Run **normalize → split gates → split lines → make snippets**.
* Then we can map *any* center/gate we create here to the **actual** Line Companion text instead of my Ra-flavored placeholders.

If you paste **one** actual gate chunk from your `.txt` (like everything under “Gate 10”), I can tune the regex to match your exact scan.
