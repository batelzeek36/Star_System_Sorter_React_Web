# Collaboration SOP (1-Page Quick Reference)

## The Simple Version

**You have 4 tiers of people. Each tier sees different things:**

### T0: Community (No Legal Docs)
- **Who**: Anyone who joins Discord
- **What they see**: The app as a user, public docs
- **What they do**: Beta test, report bugs, give feedback
- **What they get**: Free lifetime access

### T1: Contributor (Sign CLA + NDA-Lite)
- **Who**: Devs who want to contribute code
- **What they see**: Frontend code, UI components, tests, docs
- **What they DON'T see**: Mappings, scorer config, prompts
- **What they do**: Fix bugs, improve UI, write tests
- **What they get**: GitHub credit + small bounty ($50-500 per task)

### T2: Senior Contributor (Sign CLA + Full NDA)
- **Who**: Experienced devs who've proven themselves
- **What they see**: Backend code, ETL scripts, infrastructure
- **What they DON'T see**: Mappings, scorer config, prompts
- **What they do**: Build features, own systems (e.g., caching, deployment)
- **What they get**: Bigger bounties ($500-2000 per feature) OR 0.5% revenue share for 12 months

### T3: Research Co-Founder (Sign Equity + Full NDA + IP Assignment)
- **Who**: 1-2 people who will complete the mappings with you
- **What they see**: EVERYTHING (after 90-180 day trial)
- **What they do**: Research, verify, and complete the 384 gate.line mappings
- **What they get**: 7-12% equity (4-year vest, 1-year cliff)

---

## The Key Rules

1. **Always say "1,200+ hours"** - Not ranges, not "862-1,656", just one number
2. **Mappings live behind an API** - Contributors never touch the files directly
3. **Equity only after 90-180 days** - They prove themselves first
4. **Bounties > revenue share** - Easier to manage, cleaner to end
5. **No live PII on streams** - Always use pre-consented, blurred charts
6. **Watermark everything** - If it leaks, you know who leaked it

---

## What Each Legal Doc Does (Plain English)

### CLA (Contributor License Agreement)
**Translation**: "Anything you contribute becomes mine, but you get credit"
**When**: Before anyone submits code

### NDA-Lite (For T1 Contributors)
**Translation**: "Don't share what you see, don't build a competing tool"
**When**: Before they see any backend code

### Full NDA (For T2 Senior Contributors)
**Translation**: "Don't share what you see, don't build a competing tool, don't poach my team"
**When**: Before they see ETL scripts or infrastructure

### Equity Agreement (For T3 Research Co-Founder)
**Translation**: "You own X%, but it vests over 4 years. If you leave early, I can buy it back"
**When**: After 90-180 day trial, before they see mappings

### IP Assignment (For T3 Research Co-Founder)
**Translation**: "Anything you create for this project belongs to the project, not you"
**When**: Same time as Equity Agreement

---

## The 90-Day Trial (For Research Co-Founder)

**Week 1-4: Can they do the work?**
- Task: Verify 25 existing gate.line mappings against sources
- Quality bar: 90%+ accuracy, proper citations
- If pass → Move to Week 5

**Week 5-12: Can they create new work?**
- Task: Research 10 NEW gate.lines from scratch
- Quality bar: Matches your methodology, citable sources
- If pass → Move to Week 13

**Week 13-24: Are they aligned?**
- Weekly 1-hour calls
- Do they respect boundaries?
- Do they show up consistently?
- Do they "get it"?
- If yes → Offer equity

**Week 25+: Full access**
- Sign: Equity Agreement + Full NDA + IP Assignment
- Grant: Read-only access to mappings (logged, watermarked)
- Assign: Complete remaining gate.lines

---

## How to Protect the Mappings (Even from Research Co-Founder)

1. **Keep mappings in separate private repo** - Not in main codebase
2. **Give read-only access** - They can view, not download
3. **Log every access** - You'll see when they open files
4. **Watermark each file** - Unique ID per person
5. **Share in batches** - 60 lines at a time, not all 384
6. **Use an internal API** - App consumes API, not raw files
7. **Add canary tokens** - Hidden markers that alert you if leaked

---

## Compensation Cheat Sheet

| Role | Legal Docs | Compensation | Access Level |
|------|-----------|--------------|--------------|
| Community | None | Free access | App only |
| Contributor | CLA + NDA-Lite | $50-500/task | Frontend code |
| Senior Contributor | CLA + Full NDA | $500-2000/feature OR 0.5% for 12mo | Backend code |
| Research Co-Founder | Equity + NDA + IP | 7-12% equity (4yr vest) | Everything |

---

## Red Flags (Disqualify Immediately)

- Asks to see mappings before proving value
- Wants equity before doing any work
- Misses deadlines or ghosts
- Doesn't respect your methodology
- Talks about project publicly without permission
- Tries to "improve" your system before understanding it

---

## Green Flags (Fast-Track)

- Has academic background in comparative mythology
- Already knows I Ching, HD, and star systems deeply
- Obsessed with source quality and provenance
- Delivers better work than you asked for
- Asks smart questions that improve your thinking
- Respects boundaries without being told

---

## Leak Response Plan (If Mappings Get Out)

1. **Identify the leak** - Check watermarks, access logs
2. **Revoke access** - Remove them from repo immediately
3. **Rotate secrets** - Change API keys, update salts
4. **Update mappings** - Add noise, change weights slightly
5. **Contact lawyer** - Enforce NDA, pursue damages
6. **Communicate** - Tell community what happened (without details)

---

## Decision Rights (Who Decides What)

| Decision | Who Decides |
|----------|-------------|
| Product vision | You |
| Research methodology | You + Research Co-Founder |
| Technical architecture | You + Technical Co-Founder (if you have one) |
| Marketing strategy | You |
| Hiring | You (with input from Core Team) |
| Fundraising | You (with input from Core Team) |
| Major pivots | You (with input from Core Team) |

---

## Minimal Docs You Need Now

1. **CLA** (see template below)
2. **NDA-Lite** (see template below)
3. **Full NDA** (see template below)
4. **Equity Agreement** (see template below)
5. **Code of Conduct** (already in LAUNCH_SPRINT.md)
6. **Privacy Policy** (1-page, see template below)

---

## When to Use Which Doc

**Someone wants to contribute code?**
→ CLA + NDA-Lite

**Someone wants to work on backend?**
→ CLA + Full NDA

**Someone wants to help with research?**
→ Start with CLA + Full NDA, then Equity after trial

**Someone wants to beta test?**
→ No docs, just Discord Code of Conduct

---

## Final Checklist Before Sharing Anything

- [ ] They've signed the appropriate legal docs
- [ ] You've verified their identity (LinkedIn, GitHub, etc.)
- [ ] They've completed the trial period (if applicable)
- [ ] You've checked references (if applicable)
- [ ] You trust your gut
- [ ] You've watermarked the files
- [ ] You've set up access logging
- [ ] You've documented what you shared and when

---

## Bottom Line

**Tier 0-2**: They help you build the app. They never see the mappings.

**Tier 3**: They help you complete the research. They see the mappings, but only after proving themselves for 90-180 days and signing equity + NDA + IP assignment.

Keep it simple. Protect the moat. Trust your gut.
