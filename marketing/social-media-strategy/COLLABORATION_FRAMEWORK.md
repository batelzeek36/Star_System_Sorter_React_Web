# Collaboration Framework

## How to Work With Others Without Giving Away the Farm

---

## The Core Tension

You need help, but you also need to protect your IP. Here's how to balance that.

---

## What's Protected (The Moat)

### Tier 1: Never Share (Even Under NDA)

These are the crown jewels. No one sees these except you and maybe 1-2 core team members who have equity.

1. **The gate.line → star system mappings** (`star-mapping-by-gate/*.json`)
   - This is 1,200 hours of research
   - This is what makes the classification work
   - This is impossible to replicate without doing the work

2. **The GPT classification prompt** (`gpt-classification.ts`)
   - This is the secret sauce
   - This is what makes GPT give good results
   - This is easy to copy if revealed

3. **The narrative generation prompt** (`narrative-mission-prompt.md`)
   - This is what makes the narratives feel magical
   - This is what differentiates you from generic astrology

4. **The scorer config** (`scorer-config.ts`)
   - The weights, sparsify, sharpen settings
   - The exact algorithm for aggregating gate.line scores
   - The thresholds for primary/hybrid/unresolved

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
- Everything (including mappings, prompts, methodology)

**What They Can Do**:
- Make architectural decisions
- Own entire systems (e.g., "You own the classification engine")
- Represent the project publicly
- Help with fundraising/business strategy

**What They Get**:
- Equity stake (5-20% depending on role and timing)
- Co-founder title
- Profit-sharing (in addition to equity)
- Decision-making power

**Legal**: NDA + Equity Agreement (vesting schedule, cliff, buyback rights)

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
