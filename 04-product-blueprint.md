# One-page product/service blueprint for maximal public-health value in food–drug interaction labeling

**Executive summary (2–3 lines).** I should build provenance-first, label-grounded infrastructure that converts regulator-facing narrative labeling into computable, versioned food–drug interaction (FDI) and food-effect dosing “claims,” then deliver them via APIs and QA/UX layers. This directly aligns with FDA requirements to describe clinically significant food interactions and provide practical management instructions. citeturn0search0

## Concrete products/services to build

Key factual anchors for feasibility: FDA labeling explicitly covers food interactions (incl. grapefruit juice) and requires specific instructive content. citeturn0search0 US labeling is available at scale via SPL sources (DailyMed SPL downloads; openFDA labeling API). citeturn0search1turn0search2 SPL sections can be coded using LOINC section headings. citeturn1search0 EU ePI is semi-structured and the EU common standard is based on FHIR. citeturn0search7

| Product/service (name + 1-line) | Primary user(s) | Core functionality | One key metric | Main data/standards dependencies |
|---|---|---|---|---|
| **FDI Commons API** — “Versioned, provenance-preserving FDI/food-effect claims from labels” | Researchers; regulators; CDS developers | Ingest SPL/ePI → extract claims → serve via API with snippet+version provenance | % claims with valid snippet provenance | DailyMed SPL citeturn0search1; openFDA label API citeturn0search2; EU ePI/FHIR citeturn0search7; LOINC headings citeturn1search0 |
| **Label FDI QA Copilot** — “Find missing/contradictory food instructions across label sections” | Labeling teams; regulatory writers | Cross-section consistency checks; retrieval-grounded issue explanations | Issues confirmed per 100 labels | SPL sections+LOINC citeturn1search0; FDA labeling rule scope citeturn0search0 |
| **Food-Effect Dosing Extractor SDK** — “Open-source extractor for ‘with food/fasting’ instructions” | Pharma informatics; academia | Deterministic extraction + tested parsers; export JSON | F1 on gold set | DailyMed SPL citeturn0search1; openFDA citeturn0search2; LOINC citeturn1search0 |
| **FDI Actionability Dashboard** — “Benchmark how actionable food guidance is” | Regulators; payers; safety orgs | Score clarity (timing specificity, do/don’t, scope) and trend over time | % labels meeting actionability threshold | SPL corpus citeturn0search1; FDA requires practical instructions citeturn0search0 |
| **EU–US Label Crosswalk Service** — “Map ePI FHIR elements ↔ SPL sections for comparable FDI fields” | EU/US informatics; multinational MAHs | Cross-jurisdiction schema mapping; API for harmonized queries | # products with dual-source alignment | EU ePI/FHIR citeturn0search7; SPL citeturn0search1 |
| **Terminology Normalizer** — “Normalize drugs + foods + mechanisms for search/analytics” | Data product teams | Map drugs → RxNorm; clinical concepts → SNOMED CT; normalize foods/mechanisms | Duplicate-entity reduction | RxNorm citeturn1search1; SNOMED CT citeturn1search2 |
| **FDI Patient-Facing e-Leaflet Generator** — “Label-grounded plain-language food guidance (no dosing personalization)” | Patients; health systems | Retrieve label snippet → generate constrained summary with citations | Citation validity rate | SPL/openFDA citeturn0search1turn0search2; EU ePI citeturn0search7 |
| **PV Linker for Food Mentions** — “Connect adverse event food mentions to label claims” | Safety teams; regulators | Detect food mentions in PV narratives; link to label-stated FDIs | # validated label-gap hypotheses | openFDA label citeturn0search2 (plus PV sources if added later) |

## Top 3 priorities and why

1. **FDI Commons API**: maximizes reuse; directly operationalizes label-required food interaction content into computable infrastructure. citeturn0search0turn0search1  
2. **Label FDI QA Copilot**: fastest path to measurable safety/quality gains in labeling workflows while staying strictly label-grounded. citeturn0search0  
3. **Actionability Dashboard**: creates external accountability and a publishable benchmark aligned to FDA’s requirement for practical instructions. citeturn0search0  

## My next 3 actions in the first 90 days

1. Define a minimal **FDI claim schema + provenance contract** (snippet hash, label version date, section code). citeturn1search0  
2. Stand up ingestion for **DailyMed SPL bulk downloads** + index target sections. citeturn0search1  
3. Build a pilot extraction baseline (rules + retrieval) and create a small adjudicated gold set; adopt an AI risk process aligned with NIST AI RMF. citeturn2search1turn2search0  

## Expected outcomes within 12 months

- **FDI Commons v0**: an alpha API + downloadable dataset covering a meaningful SPL subset, with >95% provenance-valid claims (target). citeturn0search1  
- **QA Copilot pilot**: automated consistency checks across coded label sections (LOINC) with documented precision/recall. citeturn1search0  
- **Actionability benchmark**: public methods paper + dashboard showing actionability patterns and gaps against the “practical instructions” requirement. citeturn0search0  

## Key risks and mitigations

- **Regulatory misrepresentation** (“in-use” vs “FDA-approved”): store explicit source and effective date/version; never label content “FDA-approved” unless sourced accordingly. citeturn0search1  
- **Hallucination / fabricated content**: retrieval-only generation + hard refusal without provenance; audit every claim-to-snippet mapping. citeturn2search0turn2search11  
- **Prompt/system-instruction vulnerabilities**: isolate model from user-controlled instructions; apply NIST-style risk controls and monitoring. citeturn2search1turn2search11  
- **Licensing constraints (SNOMED CT)**: design modular mappings; provide optional SNOMED layer with licensing documentation. citeturn1search2  
- **Overgeneralization beyond the label**: explicitly tag “label-stated” vs “human clinical” vs “mechanistic-only”; do not infer new FDIs. citeturn0search0  
- **Operational drift**: rerun extraction on new SPL releases; version all outputs and report deltas. citeturn0search1  
- **Liability / “medical advice” perception**: product positioning and UX disclaimers; outputs limited to label-grounded statements, no patient-specific dosing. citeturn0search0  

## Six grant-pitch value bullets (concise)

- I convert regulator-required narrative food interaction guidance into **machine-readable, provenance-locked claims**. citeturn0search0  
- I leverage existing national infrastructures (**DailyMed SPL**, **openFDA**) to scale quickly at low marginal cost. citeturn0search1turn0search2  
- I bridge US and EU digital labeling via **ePI’s FHIR-based common standard** for cross-jurisdiction utility. citeturn0search7  
- I deliver measurable outcomes: **provenance validity**, extraction F1, and actionability improvements. citeturn1search0  
- I implement AI safely with **retrieval augmentation and auditable provenance**, aligned to widely used AI risk frameworks. citeturn2search0turn2search1  
- I produce reusable public goods: datasets, APIs, benchmarks, and standards-aligned mappings that enable downstream CDS and education without reinventing the wheel. citeturn1search1turn1search2