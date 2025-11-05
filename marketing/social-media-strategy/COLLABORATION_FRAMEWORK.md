# Collaboration Framework

## How to Work With Others Without Giving Away the Farm

---

## The Core Tension

You need help, but you also need to protect your IP. Here's how to balance that.

---

## What's Protected (The Moat)

### Tier 1: Share ONLY with Research Co-Founder (Equity Required)

These are the crown jewels. You WILL need to share these with 1-2 people to finish the mappings, but they must be:
- **Heavily invested** (equity stake, not just profit-sharing)
- **Proven trustworthy** (worked with you for 3-6 months first)
- **Deeply aligned** (as obsessed with this as you are)
- **Under NDA** (signed, enforceable, with real consequences)

**What you're sharing:**

1. **The gate.line → star system mappings** (`star-mapping-by-gate/*.json`)
   - This is 1,200+ hours of research
   - This is what makes the classification work
   - This is impossible to replicate without doing the work
   - **Why you need help**: You need someone to verify, refine, and complete the remaining mappings
   - **Who gets access**: 1-2 Research Co-Founders with 5-15% equity

2. **The scorer config** (`scorer-config.ts`)
   - The weights, sparsify, sharpen settings
   - The exact algorithm for aggregating gate.line scores
   - The thresholds for primary/hybrid/unresolved
   - **Why you need help**: You need someone to help calibrate and test accuracy
   - **Who gets access**: Same Research Co-Founder(s)

**What stays private (even from Research Co-Founder until later):**

3. **The narrative generation prompt** (`narrative-mission-prompt.md`)
   - This is what makes the narratives feel magical
   - This is easier to protect (lives server-side)
   - **When to share**: Only after 6+ months of proven collaboration

**The Research Co-Founder Vetting Process:**

This person needs to earn access through a multi-stage process:

**Stage 1: Prove Competence (Weeks 1-4)**
- Tiny task: Verify 5 gate.line mappings against sources
- If quality is high → Invite to Discord as @Map role
- Assign: Verify 20 more gate.lines, suggest improvements
- If suggestions are insightful → Move to Stage 2

**Stage 2: Prove Commitment (Weeks 5-12)**
- Assign: Research 10 NEW gate.lines from scratch (ones you haven't done yet)
- Must follow your methodology exactly
- Must cite sources properly
- Must match your quality bar
- If they deliver consistently → Move to Stage 3

**Stage 3: Prove Alignment (Weeks 13-24)**
- Weekly 1-hour calls to discuss research
- Do they "get it"? Do they care about rigor?
- Do they respect the IP boundaries?
- Do they show up consistently?
- If yes to all → Offer Research Co-Founder role

**Stage 4: Equity + NDA (Week 25+)**
- Offer: 5-15% equity (vesting over 4 years, 1-year cliff)
- Sign: NDA + Equity Agreement + IP Assignment
- Grant: Full access to mappings and scorer config
- Assign: Own the completion of remaining gate.lines

**Red Flags (Disqualify Immediately):**
- Asks to see the mappings before proving value
- Wants equity before doing any work
- Doesn't respect your methodology
- Misses deadlines or ghosts
- Tries to "improve" your system before understanding it
- Talks about the project publicly without permission

**Green Flags (Fast-Track):**
- Has academic background in comparative mythology
- Already knows I Ching, HD, and star systems deeply
- Obsessed with source quality and provenance
- Delivers better work than you asked for
- Asks smart questions that improve your thinking
- Respects boundaries without being told

### Tier 2: Share Under NDA (Core Team Only)

These are sensitive but shareable with people who have skin in the game.

1. **The research methodology** (how you go from text to mappings)
2. **The bibliography** (full list of sources with page numbers)
3. **The ETL scripts** (the Python pipeline)
4. **The validation process** (quality gates, dispute tracking)
5. **The business strategy** (monetization, roadmap, fundraising)

### Tier 3: Share Publicly (Marketing Assets)

These are safe to show and help build credibility.

1. **The app UI** (screens, flows, components)
2. **The tech stack** (React, Express, GPT-4o, etc.)
3. **The architecture** (client → proxy → API)
4. **The testing setup** (Vitest, Playwright, coverage)
5. **The research scope** (1,200 hours, 384 mappings, primary sources)
6. **The star system archetypes** (high-level descriptions, no mappings)
7. **Sample results** (anonymized classifications, narratives)

---

## Collaboration Tiers

### Tier 1: Community Members (No NDA Required)

**Who**: Anyone who joins the Discord or follows on social media

**What They Can See**:
- The app (as users)
- Public documentation
- High-level architecture
- Sample results

**What They Can Do**:
- Beta test
- Report bugs
- Suggest features
- Share feedback

**What They Get**:
- Free lifetime access
- Early access to features
- Community badge

**Legal**: No NDA, no contract, no equity

---

### Tier 2: Contributors (Contributor Agreement Required)

**Who**: Developers, designers, writers who want to contribute code/content

**What They Can See**:
- The frontend codebase (React, UI components)
- The non-sensitive backend (Express routes, caching, validation)
- The testing suite
- The deployment setup

**What They CANNOT See**:
- The classification logic
- The GPT prompts
- The research mappings
- The ETL scripts

**What They Can Do**:
- Write tests
- Fix bugs
- Improve UI/UX
- Write documentation
- Build new features (that don't touch classification)

**What They Get**:
- GitHub contributor credit
- Profit-sharing (1-5% of net revenue, vested over 1 year)
- Co-author credit on any papers/publications
- "Contributor" badge in the app

**Legal**: Contributor Agreement (you retain IP, they get credit + profit share)

**Template Agreement**:

```
CONTRIBUTOR AGREEMENT

This agreement is between [Your Name] ("Owner") and [Contributor Name] ("Contributor").

1. SCOPE OF WORK
Contributor agrees to contribute [specific work: code, design, content] to the Star System Sorter project.

2. INTELLECTUAL PROPERTY
All contributions become the property of Owner. Contributor retains no ownership rights but receives credit and profit-sharing as outlined below.

3. COMPENSATION
Contributor receives:
- Public credit (GitHub, app credits, publications)
- [X]% of net revenue, vested over 12 months
- Early access to all features

4. CONFIDENTIALITY
Contributor agrees not to share:
- Proprietary algorithms or mappings
- Business strategy or financial information
- User data or analytics

5. TERMINATION
Either party may terminate this agreement with 30 days notice. Vested profit-sharing continues; unvested shares are forfeited.

Signed: _________________ Date: _______
```

---

### Tier 3: Core Team (NDA + Equity Agreement Required)

**Who**: 2-5 people who are building this with you long-term

**What They Can See**:
- **Research Co-Founder(s)**: Full access to mappings + scorer config (after 6-month vetting)
- **Technical Co-Founder**: Full access to codebase, architecture, deployment (but NOT mappings unless they also do research)
- **Business Co-Founder**: Access to strategy, financials, partnerships (but NOT technical IP)

**What They Can Do**:
- Make architectural decisions in their domain
- Own entire systems (e.g., "You own the research layer" or "You own the infrastructure")
- Represent the project publicly (with your approval)
- Help with fundraising/business strategy

**What They Get**:
- Equity stake (5-20% depending on role and timing)
- Co-founder title
- Profit-sharing (in addition to equity)
- Decision-making power (within their domain)

**Legal**: NDA + Equity Agreement (vesting schedule, cliff, buyback rights)

**Important**: Not all Core Team members need access to the mappings. Only the Research Co-Founder(s) who are actively working on completing them. The Technical Co-Founder can build the app without seeing the mappings - they just need the API that consumes them.

**Template NDA**:

```
NON-DISCLOSURE AGREEMENT

This agreement is between [Your Name] ("Discloser") and [Core Team Member] ("Recipient").

1. CONFIDENTIAL INFORMATION
Recipient will have access to proprietary information including:
- Gate.line → star system mappings
- GPT classification and narrative prompts
- Research methodology and sources
- Business strategy and financial data

2. OBLIGATIONS
Recipient agrees to:
- Keep all confidential information secret
- Not use confidential information for personal gain
- Not share confidential information with third parties
- Return or destroy all confidential materials upon termination

3. TERM
This agreement remains in effect for 5 years from the date of signing.

4. REMEDIES
Breach of this agreement may result in legal action and financial damages.

Signed: _________________ Date: _______
```

**Template Equity Agreement**:

```
EQUITY AGREEMENT

This agreement is between [Your Name] ("Founder") and [Core Team Member] ("Member").

1. EQUITY GRANT
Member receives [X]% equity in Star System Sorter, subject to vesting.

2. VESTING SCHEDULE
- 1-year cliff (no equity vests until 1 year of active contribution)
- 4-year total vesting (25% per year after cliff)
- Monthly vesting after cliff

3. ROLES & RESPONSIBILITIES
Member agrees to [specific role: CTO, Head of Research, etc.] and commit [X hours/week].

4. BUYBACK RIGHTS
If Member leaves before full vesting, Founder has the right to buy back unvested shares at fair market value.

5. DECISION-MAKING
Major decisions (fundraising, pivots, exits) require [majority/unanimous] vote of all equity holders.

Signed: _________________ Date: _______
```

---

## How to Onboard Each Tier

### Community Members (Tier 1)

**Process**:
1. They join Discord or follow on social media
2. They apply to be a beta tester (Google Form)
3. You approve them (manually at first, automated later)
4. They get access to the app (private beta link)
5. They provide feedback (Discord, surveys, bug reports)

**Time Investment**: 5-10 min per person (mostly automated)

---

### Contributors (Tier 2)

**Process**:
1. They express interest (Discord, DM, email)
2. You have a 30-min call to assess fit
3. They sign the Contributor Agreement
4. You give them access to the public repos
5. They pick a task from the backlog (GitHub Issues)
6. They submit a PR, you review and merge
7. They get credit + profit-sharing

**Time Investment**: 1-2 hours per person (initial setup), then ongoing code review

**Red Flags to Watch For**:
- Asking to see the mappings or prompts
- Wanting equity without proving value first
- Not respecting boundaries ("Why can't I see the classification logic?")
- Flaky communication or missed deadlines

**Green Flags to Look For**:
- Respects the IP boundaries
- Asks good questions about the public codebase
- Delivers quality work on time
- Proactive about finding ways to help
- Excited about the mission, not just the tech

---

### Core Team (Tier 3)

**Process**:
1. You've worked with them as a Contributor for 3-6 months
2. They've proven they're reliable, skilled, and aligned
3. You have a serious conversation about long-term commitment
4. They sign the NDA + Equity Agreement
5. You give them access to everything
6. They own a major system or domain
7. You meet weekly to align on strategy

**Time Investment**: 10-20 hours/week (this is a co-founder relationship)

**Who to Look For**:
- **Technical Co-Founder**: Senior full-stack dev who can own the entire app architecture
- **Research Co-Founder**: Academic or mythology expert who can expand and validate the research
- **Business Co-Founder**: Someone who can handle fundraising, marketing, partnerships
- **Design Co-Founder**: UX/UI expert who can make this world-class beautiful

**Red Flags**:
- Wants equity before proving value
- Doesn't have time to commit (this is a part-time side project for them)
- Wants to change the vision (they want to build something different)
- Doesn't respect your leadership (they want to be the boss)

**Green Flags**:
- Has already contributed significantly as Tier 2
- Brings a skill you don't have
- Is as obsessed with this as you are
- Respects your vision but challenges you to be better
- Has a track record of finishing things

---

## How to Say No (Without Burning Bridges)

### When Someone Asks to See the Mappings

"I appreciate your interest, but the mappings are proprietary - that's the core IP. What I can show you is the results, the architecture, and the research scope. If you want to contribute, there's plenty of work to do on the frontend, testing, and documentation. And if we work together long-term and you prove you're committed, we can talk about deeper access."

### When Someone Wants Equity Immediately

"I don't give equity to people I haven't worked with. Here's what I suggest: contribute as a Tier 2 collaborator for 3-6 months. If we work well together and you're adding real value, we can talk about equity. I'm looking for co-founders, not contractors - but I need to see the fit first."

### When Someone Wants to "Partner" But Brings No Skills

"I appreciate the offer, but I'm looking for people who can contribute specific skills - development, research, design, business. If you're passionate about the project, the best way to help right now is to beta test, share feedback, and spread the word. If you develop skills that are relevant, let's reconnect."

### When Someone Wants to Build a Competing Product

"Go for it. But you'll need to replicate 1,200 hours of research, and I don't think you'll get the same results. If you want to build something in this space, I'd rather collaborate than compete - there's room for multiple approaches. But if you're just trying to copy what I've done, you're going to have a hard time."

---

## How to Share the Mappings Safely

If you're going to share the crown jewels with a Research Co-Founder, here's how to protect yourself:

### 1. Watermark the Files

Before sharing, add a unique identifier to each mapping file that traces back to this specific person:

```json
{
  "metadata": {
    "shared_with": "Research Co-Founder Name",
    "shared_date": "2024-11-04",
    "access_id": "RC-001-[random-hash]"
  },
  "gate": "1",
  "lines": { ... }
}
```

If the mappings leak, you'll know who leaked them.

### 2. Share Incrementally

Don't give them all 384 mappings at once. Share in batches:

**Week 1**: Gates 1-10 (60 lines)  
**Week 2**: Gates 11-20 (60 lines)  
**Week 3**: Gates 21-30 (60 lines)  
...and so on.

If they leak early, you've only lost a fraction of the work.

### 3. Use a Private Repo with Audit Logs

- Host the mappings in a private GitHub repo
- Give them read-only access initially
- Enable audit logging (GitHub Enterprise or similar)
- You'll see every time they access a file

### 4. Require Them to Work On-Site (If Possible)

If they're local, have them work at your place (or a shared workspace) for the first 3 months. They can view the mappings on your machine, but they can't download them.

### 5. Use a Non-Compete Clause

In the NDA, include:

"Recipient agrees not to create, contribute to, or consult on any competing star system classification tool for 3 years after termination of this agreement."

### 6. Document Everything

- Keep a log of what you shared and when
- Save all communications (Slack, email, Discord)
- If they breach, you'll need evidence

### 7. Trust Your Gut

If something feels off, don't share. You can always find someone else. You can't un-share the mappings.

---

## How to Protect Yourself Legally

### 1. Always Use Contracts

Even with friends. Especially with friends. Handshake deals fall apart when money gets involved.

### 2. Register Your IP

- **Trademark**: "Star System Sorter" (if you plan to monetize)
- **Copyright**: The research dataset, the app code, the narratives
- **Trade Secret**: The mappings and prompts (don't publish, don't patent - keep secret)

### 3. Use a Business Entity

Don't do this as a sole proprietor. Set up an LLC or C-corp (depending on your fundraising plans). This protects your personal assets if someone sues.

### 4. Get Insurance

If you're giving people readings, get professional liability insurance. If someone claims your app caused them harm (even if it's bullshit), you want coverage.

### 5. Have a Lawyer Review Your Agreements

Don't use my templates verbatim. Have a lawyer customize them for your situation. It'll cost $500-2,000 but it's worth it.

---

## How to Handle Disputes

### Scenario 1: A Contributor Wants More Money

**Response**: "I appreciate your work, but the profit-sharing is based on the agreement we signed. If you want to renegotiate, let's talk about what additional value you're bringing. But I can't change the terms retroactively."

### Scenario 2: A Core Team Member Wants to Leave

**Response**: "I'm sorry to hear that. Per our agreement, your vested equity stays with you, but unvested shares are forfeited. I have the option to buy back your vested shares at fair market value. Let's work out a transition plan so we can part on good terms."

### Scenario 3: Someone Leaks the Mappings

**Response**: "This is a breach of the NDA. I'm going to pursue legal action. I'm also going to change the mappings so the leaked version is obsolete. And I'm going to be more careful about who I trust going forward."

### Scenario 4: Someone Claims You Stole Their Idea

**Response**: "I've been working on this for [X months/years] and I have timestamped commits, research notes, and receipts to prove it. If you think you have a claim, talk to a lawyer. But I'm confident this is my work."

---

## Red Flags in Collaboration Requests

### 🚩 "I have an idea that will make this 10x better, but I can't tell you unless you sign an NDA"

Translation: They want to see your work before showing theirs. Pass.

### 🚩 "I'm a [vague title] with [vague experience] and I want to be a co-founder"

Translation: They want equity without proving value. Pass.

### 🚩 "I can build this in a weekend"

Translation: They don't understand the complexity. Pass.

### 🚩 "You should pivot to [completely different idea]"

Translation: They want to build their thing, not yours. Pass.

### 🚩 "I know a VC who will fund this, but you need to give me 20% equity to make the intro"

Translation: They're trying to extract value without contributing. Pass.

### 🚩 "I'm a [astrologer/HD analyst/spiritual teacher] and I should be the face of this"

Translation: They want credit for your work. Pass.

---

## Green Flags in Collaboration Requests

### ✅ "I love what you're building. Here's a PR that fixes [specific bug]."

Translation: They're contributing before asking for anything. Engage.

### ✅ "I've been researching [related topic] for years. Here are my sources. Want to compare notes?"

Translation: They have real expertise and are willing to share. Engage.

### ✅ "I'm a [specific skill] and I'd love to help. What do you need most right now?"

Translation: They're offering value, not asking for it. Engage.

### ✅ "I've been beta testing for a month and here's my detailed feedback..."

Translation: They're invested and thoughtful. Engage.

### ✅ "I don't need equity - I just think this is cool and want to contribute."

Translation: They're intrinsically motivated. Engage (and consider giving them equity anyway if they're great).

---

## The Golden Rule

**Protect the IP, but don't be paranoid.**

You need collaborators to finish this. But you also need to be strategic about who you let in and what you share.

The mappings and prompts are the moat. Everything else is shareable.

If someone proves they're trustworthy, skilled, and aligned, give them more access. If they prove they're not, cut them loose quickly.

And always, always use contracts.

---

## Final Thought

You're not just building an app. You're building a team, a community, and a movement.

The people who help you build this will shape what it becomes. Choose wisely.
