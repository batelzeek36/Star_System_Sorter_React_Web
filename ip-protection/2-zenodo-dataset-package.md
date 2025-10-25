# Zenodo Dataset Package - Star System Sorter (S³)
**Preparation Guide for Public Archive with DOI**

---

## What is Zenodo?

**Zenodo** (https://zenodo.org/) is a free, open-access repository operated by CERN that:
- Mints a **permanent DOI** for your record (plus a **concept DOI** that aggregates all versions)
- Provides a **timestamped, citable** public archive of your work
- Commits to **long-term preservation** (at least 20 years, tied to CERN's programme)
- Supports **versioning** (each new version gets its own DOI; the concept DOI points to the latest)

**Note:** Google Scholar **does not index Zenodo** at this time (per Zenodo). Your DOI is still resolvable and citable via DataCite and common reference managers.

**Why use it:** Establishes public proof of your methodology and research with a specific date, making it citable and defensible.

---

## Filing Instructions

### Step 1: Create Zenodo Account
1. Go to https://zenodo.org/
2. Click "Sign Up" (top right)
3. Use GitHub login (recommended) or create account with email
4. Verify your email address

### Step 2: Prepare Your Dataset
Follow the file structure below (already prepared in this document).

### Step 3: Upload to Zenodo
1. Log in to Zenodo
2. Click "Upload" → "New Upload"
3. Upload files (drag & drop or select)
4. Fill in metadata (see template below)
5. Choose license: **CC BY 4.0** (recommended for academic work)
6. Click "Publish" (cannot be undone, but you can create new versions)

### Step 4: Get Your DOI
Zenodo assigns:
- A **version DOI** (this specific upload) - e.g., `10.5281/zenodo.1234567`
- A **concept DOI** (the family of versions; always resolves to the latest by default) - e.g., `10.5281/zenodo.1234566`

**Which to use:**
- Use the **version DOI** when you need to cite an exact snapshot
- Use the **concept DOI** when you want a stable link to "the latest"

Save both DOIs - add them to your project README and website.

### Step 5: Update Your Project
- Add DOI badge to GitHub README
- Reference DOI in academic papers
- Include DOI in copyright notices

---

## Zenodo Metadata Template

**Copy this into Zenodo's upload form:**

### Basic Information
- **Upload type:** Dataset
- **Publication date:** 2025-10-24
- **Title:** Star System Sorter (S³): Human Design Gate·Line to Star System Classification - Research Methodology and Dataset
- **Authors:** [Your Full Name] (ORCID: [if you have one])
- **Description:** (see below)

### Description (copy this):
```
Star System Sorter (S³) is a digital humanities research project that maps Human Design Gate·Line combinations (384 total) to star system archetypes using scholarly-style comparative mythology research.

This dataset contains:
- Complete research methodology with quality gates and validation processes
- Star system baseline prompts with scholarly-style citation requirements
- Research outputs with JSON schemas and provenance tracking
- I Ching multi-translation comparison framework
- Transparent scoring rubric for reproducible classification

Research scope: 862-1,656 hours of rigorous comparative mythology research across 9 star systems, 64 Human Design gates, 6 line archetypes, and 384 Gate·Line combinations.

Key novelty: To our knowledge (as of Oct 2025), first application to combine (1) Human Design Gate·Line granularity, (2) multi-translation I Ching citations, (3) transparent scoring algorithm, and (4) star system lore mapping with scholarly-style provenance.

This is an interpretive humanities project, not scientific prediction. All claims are properly sourced with translator names, ISBNs, and page numbers.
```

### Keywords (add these):
- Human Design
- I Ching
- Star Systems
- Comparative Mythology
- Digital Humanities
- Starseed
- Gate Line Analysis
- Pleiades
- Sirius
- Lyra
- Andromeda
- Orion
- Arcturus
- Draco
- Zeta Reticuli

### License
- **For data/documentation:** Creative Commons Attribution 4.0 International (CC BY 4.0) - Recommended
  - Allows others to use with attribution, standard for academic datasets
  - **Alternative:** CC0 if you want maximal reuse without attribution requirement
- **For code (if included):** MIT or Apache-2.0 (more appropriate for software)
- **For mixed content:** CC BY 4.0 for data, note code separately if applicable
- **Alternative:** CC BY-NC 4.0 (non-commercial) if you want to restrict commercial use

### Related Identifiers (optional)
- **GitHub repository:** https://github.com/[your-username]/star-system-sorter
- **Project website:** [if you have one]
- **Concept DOI:** [Add this after first upload for subsequent versions]

### Funding (if applicable)
- Self-funded research project

### Version
- v1.0.0 (Initial public release)

---

## Files to Include in Zenodo Upload

### Required Files

#### 1. README.md (Overview)
```markdown
# Star System Sorter (S³) - Research Dataset v1.0.0

## Overview
This dataset contains the complete research methodology and outputs for Star System Sorter (S³), a digital humanities project mapping Human Design Gate·Line combinations to star system archetypes.

## Contents
- `/methodology/` - Complete research methods and quality gates
- `/star-systems/` - 9 baseline star system prompts with citations
- `/research-outputs/` - JSON schemas and sample outputs
- `/documentation/` - Human Design and I Ching reference materials
- `/schemas/` - Data validation schemas

## Citation
If you use this dataset, please cite:
[Your Name]. (2025). Star System Sorter (S³): Human Design Gate·Line to Star System Classification - Research Methodology and Dataset (v1.0.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.XXXXXXX

## License
CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/

## Contact
[Your Email]
[Project Website]
```

#### 2. METHODOLOGY.md (from your repo)
Copy from: `lore-research/documentation/` or create comprehensive version

#### 3. Star System Baselines (9 files)
From: `lore-research/prompts/PHASE_0_STAR_SYSTEMS/`
- PLEIADES_BASELINE.txt
- SIRIUS_BASELINE.txt
- LYRA_BASELINE.txt
- ANDROMEDA_BASELINE.txt
- ORION_LIGHT_BASELINE.txt
- ORION_DARK_BASELINE.txt
- ARCTURUS_BASELINE.txt (if exists)
- DRACO_BASELINE.txt
- ZETA_RETICULI_BASELINE.txt (if exists)

#### 4. Bulletproof Methodology
From: `lore-research/prompts/PHASE_0_STAR_SYSTEMS/`
- BULLETPROOF_COMPLETE.md
- BULLETPROOF_QUICK_REFERENCE.md

#### 5. Sample Research Outputs
From: `lore-research/research-outputs/star-systems/`
- pleiades-baseline.json
- sirius-baseline.json
- orion-light-baseline.json
- ENHANCED_JSON_EXAMPLE.json

#### 6. Documentation
From: `lore-research/documentation/`
- human-design.md
- Any other reference docs

#### 7. Prior Art Comparison
From: `ip-protection/`
- 1-prior-art-comparison.md (this establishes novelty)

### Optional but Recommended

#### 8. CHANGELOG.md
```markdown
# Changelog

## v1.0.0 (2025-10-24)
- Initial public release
- 9 star system baselines with bulletproof methodology
- Complete research methodology documentation
- Sample JSON outputs with citation schemas
- Prior art comparison establishing novelty
```

#### 9. LICENSE.txt
```
Creative Commons Attribution 4.0 International (CC BY 4.0)

Copyright (c) 2025 [Your Name]

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

Full license: https://creativecommons.org/licenses/by/4.0/legalcode
```

---

## Folder Structure for Upload

```
star-system-sorter-dataset-v1/
├── README.md
├── LICENSE.txt
├── CHANGELOG.md
├── METHODOLOGY.md
├── methodology/
│   ├── bulletproof-complete.md
│   ├── bulletproof-quick-reference.md
│   └── quality-gates.md
├── star-systems/
│   ├── pleiades-baseline.txt
│   ├── sirius-baseline.txt
│   ├── lyra-baseline.txt
│   ├── andromeda-baseline.txt
│   ├── orion-light-baseline.txt
│   ├── orion-dark-baseline.txt
│   ├── arcturus-baseline.txt
│   ├── draco-baseline.txt
│   └── zeta-reticuli-baseline.txt
├── research-outputs/
│   ├── pleiades-baseline.json
│   ├── sirius-baseline.json
│   ├── orion-light-baseline.json
│   └── enhanced-json-example.json
├── documentation/
│   ├── human-design.md
│   └── i-ching-reference.md
└── prior-art/
    └── novelty-comparison.md
```

---

## After Publishing on Zenodo

### 1. Add DOI Badge to GitHub README
```markdown
<!-- Use concept DOI for always-latest link -->
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)
```

### 2. Update Project Documentation
Add to your main README:
```markdown
## Research Dataset

The complete research methodology and dataset for S³ is publicly archived on Zenodo with a permanent DOI:

**Citation (latest version):**
[Your Name]. (2025). Star System Sorter (S³): Human Design Gate·Line to Star System Classification - Research Methodology and Dataset [Data set]. Zenodo. https://doi.org/10.5281/zenodo.XXXXXXX (concept DOI - always points to latest)

**Citation (specific version):**
[Your Name]. (2025). Star System Sorter (S³): Human Design Gate·Line to Star System Classification - Research Methodology and Dataset (v1.0.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.YYYYYYY (version DOI)
```

### 3. Add to Your Website
Include on your "About" or "Methodology" page:
```
Our research methodology is publicly archived and citable:
[DOI Badge/Link - use concept DOI]
```

### 4. Use in Academic Contexts
- Reference in papers: "Methods described in [Your Name] (2025)" with DOI
- Include in CV/portfolio as published dataset
- Share with collaborators and reviewers
- Use version DOI when citing specific methodology snapshot
- Use concept DOI for general reference to your work

---

## Version Updates

When you update your research:
1. Go to your Zenodo record
2. Click "New Version"
3. Upload updated files
4. Zenodo creates a **new version DOI** and updates the **concept DOI**

**Important:** Older version DOIs remain valid and point to their specific snapshots; they do not redirect. The **concept DOI** always points to the latest version by default.

---

## Cost

**FREE** - Zenodo is completely free for uploads. 

**Default limits:** 
- 50 GB per record
- Up to 100 files per record

**Larger needs:** May be granted **once** (up to ~200 GB for a single record) on request; file-count cap still applies. Contact Zenodo support if you need more.

---

## Timeline

- **Account creation:** 5 minutes
- **File preparation:** 1-2 hours (organizing existing files)
- **Upload & metadata:** 30 minutes
- **Publication:** Instant (DOI assigned immediately)

**Total time:** ~2-3 hours

---

## Checklist

- [ ] Create Zenodo account
- [ ] Organize files into folder structure above
- [ ] Write README.md with overview
- [ ] Copy methodology files from repo
- [ ] Include all 9 star system baselines
- [ ] Add sample JSON outputs
- [ ] Include prior art comparison
- [ ] Prepare metadata (title, description, keywords)
- [ ] Choose CC BY 4.0 license
- [ ] Upload to Zenodo
- [ ] Publish and get DOI
- [ ] Add DOI badge to GitHub README
- [ ] Update project documentation with citation
- [ ] Save DOI for copyright registration (document #3)

---

## Support

- **Zenodo Help:** https://help.zenodo.org/
- **Zenodo FAQ:** https://help.zenodo.org/faq/
- **Contact:** info@zenodo.org

---

**Next Step:** Proceed to document #3 (Copyright Registration) after publishing on Zenodo.
