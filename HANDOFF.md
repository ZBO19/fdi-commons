# FDI Commons — Project Handoff

## What This Project Is
The **Label-Grounded Food–Drug Interaction Commons** — a master's thesis × deep-tech venture that extracts food–drug interaction (FDI) data from FDA SPL drug labeling and structures it into a provenance-locked, open-core dataset.

## What's Been Built

### 1. Promotional Landing Page (`landing/`)
- **Files:** `index.html`, `style.css`, `script.js`
- **Design:** Premium dark theme, glassmorphism, gradient accents, scroll animations
- **Sections:** Hero, Problem (21 CFR 201.57), Evidence Table (8 mechanistic FDI exemplars), Solution (provenance + schema), Pipeline (4-stage SPL→API), Product Portfolio (6 ranked products), Segments, Academic Foundation (professor names, CERSI network, funding alignment), Commercial Model (open-core + paid QA), Trust & Safety, Contact Form
- **Content sourced from:** All 5 deep-research-report.md files + Caroline doc

### 2. MVP Product (`mvp/`)
- **Files:** `index.html`, `style.css`, `app.js`
- **Functionality:** Connects to live openFDA Drug Labeling API, searches by drug name, extracts FDI claims using 50+ food trigger patterns, generates QA reports (missing sections, contradictions, cross-section issues), displays provenance metadata, exports JSON + text reports
- **Tech:** Pure HTML/CSS/JS, no frameworks, no build step

### 3. Research Documents (kept from cleanup)
- `Caroline _ Stanford Medicine.md` + `.docx` — Professor contacts (Nigam Shah, Russ Altman, Isaac Kohane, Atul Butte, Noémie Elhadad), email templates for German prof & US host, 2-page concept paper, 1-page research pitch
- `deep-research-report.md` — Core thesis research (25KB)
- `deep-research-report (1).md` — 8-project portfolio + 3-year roadmap (40KB)
- `deep-research-report (2).md` — Thesis + venture fit + 90-day plan (12KB)
- `deep-research-report (9).md` — One-page product blueprint (8KB)
- `deep-research-report (11).md` — PRD / 90-day sprint (3.5KB)
- `Don't Reinvent the Wheel.md` — Landscape analysis (existing systems, gaps)
- `drug_name.txt` — FDI claim schema fields

## What Was Deleted (cleanup)
15 duplicate/empty/superseded files were removed. `The 10× Insight.pdf` still needs manual deletion (special char in filename).

## Candidate Background
- Pharmacology degree
- Current master's in food science
- Experience in German Armed Forces
- This combination uniquely positions the candidate for diet–drug interaction research

## Key Design Decisions
- **Provenance-first:** Every claim traces to exact label snippet + version
- **Evidence tier separation:** Label-stated / Human clinical / Mechanistic-only (never auto-upgrade)
- **Zero hallucination policy:** LLM use optional, strictly retrieval-grounded, citations programmatically attached
- **NIST AI RMF aligned** for content provenance and risk controls
- **CC0 data** (openFDA is public domain) — enables commercial reuse

## What's Next
1. Delete `The 10× Insight.pdf` manually
2. Set up Git identity (`git config --global user.email/user.name`) and commit
3. Test pages in browser (`landing/index.html` and `mvp/index.html`)
4. Prepare professor outreach emails (templates in Caroline doc)
5. Consider deployment (GitHub Pages, Vercel, or Netlify)
6. Optionally rename deep-research-report files with numbered prefixes for clarity
