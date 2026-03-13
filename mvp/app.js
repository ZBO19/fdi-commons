// ===== FDI Label QA — MVP Application =====
// Connects to the real openFDA Drug Labeling API
// Extracts food–drug interaction claims with provenance

const OPENFDA_BASE = 'https://api.fda.gov/drug/label.json';

// Known food/beverage triggers for FDI extraction
const FOOD_TRIGGERS = [
  { term: 'grapefruit', category: 'Fruit' },
  { term: 'grapefruit juice', category: 'Beverage' },
  { term: 'orange juice', category: 'Beverage' },
  { term: 'pomelo', category: 'Fruit' },
  { term: 'seville orange', category: 'Fruit' },
  { term: 'cranberry', category: 'Fruit' },
  { term: 'cranberry juice', category: 'Beverage' },
  { term: 'alcohol', category: 'Beverage' },
  { term: 'ethanol', category: 'Beverage' },
  { term: 'alcoholic beverages', category: 'Beverage' },
  { term: 'dairy', category: 'Dairy' },
  { term: 'milk', category: 'Dairy' },
  { term: 'calcium', category: 'Mineral' },
  { term: 'iron', category: 'Mineral' },
  { term: 'magnesium', category: 'Mineral' },
  { term: 'antacid', category: 'OTC' },
  { term: 'vitamin k', category: 'Vitamin' },
  { term: 'green leafy vegetables', category: 'Vegetable' },
  { term: 'leafy green', category: 'Vegetable' },
  { term: 'broccoli', category: 'Vegetable' },
  { term: 'spinach', category: 'Vegetable' },
  { term: 'kale', category: 'Vegetable' },
  { term: 'food', category: 'General' },
  { term: 'high-fat meal', category: 'Meal Type' },
  { term: 'high fat meal', category: 'Meal Type' },
  { term: 'high-fat, high-calorie', category: 'Meal Type' },
  { term: 'fatty meal', category: 'Meal Type' },
  { term: 'fat content', category: 'Meal Type' },
  { term: 'fasting', category: 'Meal Timing' },
  { term: 'fasted', category: 'Meal Timing' },
  { term: 'empty stomach', category: 'Meal Timing' },
  { term: 'with food', category: 'Meal Timing' },
  { term: 'without food', category: 'Meal Timing' },
  { term: 'before meals', category: 'Meal Timing' },
  { term: 'after meals', category: 'Meal Timing' },
  { term: 'on an empty stomach', category: 'Meal Timing' },
  { term: 'dietary supplement', category: 'Supplement' },
  { term: 'herbal', category: 'Supplement' },
  { term: 'st. john', category: 'Supplement' },
  { term: "st. john's wort", category: 'Supplement' },
  { term: 'caffeine', category: 'Beverage' },
  { term: 'coffee', category: 'Beverage' },
  { term: 'tea', category: 'Beverage' },
  { term: 'tyramine', category: 'Amino Acid' },
  { term: 'aged cheese', category: 'Dairy' },
  { term: 'fermented', category: 'Fermented' },
  { term: 'soy', category: 'Legume' },
  { term: 'fiber', category: 'Nutrient' },
  { term: 'potassium', category: 'Mineral' },
  { term: 'sodium', category: 'Mineral' },
  { term: 'charcoal', category: 'Supplement' },
  { term: 'bioavailability', category: 'PK Parameter' },
  { term: 'absorption', category: 'PK Parameter' },
  { term: 'AUC', category: 'PK Parameter' },
  { term: 'Cmax', category: 'PK Parameter' },
];

// Label sections of interest (mapped to openFDA field names)
const LABEL_SECTIONS = [
  { key: 'drug_interactions', label: 'Drug Interactions', loinc: '34073-7' },
  { key: 'dosage_and_administration', label: 'Dosage & Administration', loinc: '34068-7' },
  { key: 'clinical_pharmacology', label: 'Clinical Pharmacology', loinc: '34090-1' },
  { key: 'warnings_and_cautions', label: 'Warnings & Precautions', loinc: '43685-7' },
  { key: 'warnings', label: 'Warnings', loinc: '34071-1' },
  { key: 'contraindications', label: 'Contraindications', loinc: '34070-3' },
  { key: 'precautions', label: 'Precautions', loinc: '42232-9' },
  { key: 'information_for_patients', label: 'Patient Information', loinc: '34076-0' },
  { key: 'food_safety_warning', label: 'Food Safety Warning', loinc: '43630-3' },
];

// State
let currentDrugData = null;
let currentClaims = [];
let currentQA = null;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initQuickSearch();
  checkAPIStatus();
});

// ===== API Status Check =====
async function checkAPIStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  try {
    const res = await fetch(`${OPENFDA_BASE}?search=_exists_:openfda.brand_name&limit=1`);
    if (res.ok) {
      statusDot.style.background = 'var(--accent-green)';
      statusDot.style.boxShadow = '0 0 6px rgba(46,125,50,0.4)';
      statusText.textContent = 'openFDA API — Online';
    } else {
      throw new Error('API Error');
    }
  } catch {
    statusDot.style.background = 'var(--cardinal)';
    statusDot.style.boxShadow = '0 0 6px rgba(140,21,21,0.4)';
    statusText.textContent = 'openFDA API — Offline';
  }
}

// ===== Search =====
function initSearch() {
  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');

  btn.addEventListener('click', () => performSearch(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch(input.value);
  });
}

function initQuickSearch() {
  document.querySelectorAll('.quick-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const drug = btn.dataset.drug;
      document.getElementById('search-input').value = drug;
      performSearch(drug);
    });
  });
}

async function performSearch(query) {
  query = query.trim();
  if (!query) return;

  showLoading();

  try {
    // Search openFDA for the drug
    const searchTerm = encodeURIComponent(`openfda.brand_name:"${query}" OR openfda.generic_name:"${query}"`);
    const url = `${OPENFDA_BASE}?search=${searchTerm}&limit=1`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        showNoResults(query);
        return;
      }
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      showNoResults(query);
      return;
    }

    currentDrugData = data.results[0];
    processLabel(currentDrugData);
  } catch (err) {
    console.error('Search error:', err);
    showNoResults(query, err.message);
  }
}

// ===== Process Label =====
function processLabel(label) {
  // Extract FDI claims
  currentClaims = extractFDIClaims(label);

  // Generate QA report
  currentQA = generateQAReport(label, currentClaims);

  // Render everything
  renderDrugInfo(label);
  renderQAReport(currentQA);
  renderClaims(currentClaims);
  renderSections(label);

  hideLoading();
  showResults();
}

// ===== FDI Claim Extraction =====
function extractFDIClaims(label) {
  const claims = [];
  const timestamp = new Date().toISOString();

  LABEL_SECTIONS.forEach((sec) => {
    const rawContent = label[sec.key];
    if (!rawContent) return;

    const text = Array.isArray(rawContent) ? rawContent.join('\n') : String(rawContent);
    // Strip HTML tags for analysis
    const cleanText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    // Split into sentences (rough)
    const sentences = cleanText.split(/(?<=[.!?])\s+/);

    sentences.forEach((sentence) => {
      const lowerSentence = sentence.toLowerCase();

      FOOD_TRIGGERS.forEach((trigger) => {
        if (lowerSentence.includes(trigger.term.toLowerCase())) {
          // Determine directionality
          const direction = inferDirection(lowerSentence, trigger.term);

          // Generate snippet hash (simple)
          const snippetHash = simpleHash(sentence.trim().substring(0, 100));

          claims.push({
            id: `claim-${claims.length + 1}`,
            foodTrigger: trigger.term,
            foodCategory: trigger.category,
            direction: direction,
            sentence: sentence.trim(),
            section: sec.label,
            sectionKey: sec.key,
            sectionLOINC: sec.loinc,
            snippetHash: snippetHash,
            extractedAt: timestamp,
            source: 'openFDA Drug Labeling API',
            method: 'keyword-pattern-match-v1',
            labelStatus: 'in-use (DailyMed equivalent)',
          });
        }
      });
    });
  });

  // Deduplicate by snippet hash + food trigger
  const seen = new Set();
  return claims.filter((c) => {
    const key = `${c.snippetHash}-${c.foodTrigger}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferDirection(text, trigger) {
  const lower = text.toLowerCase();

  if (/\b(avoid|do not|should not|must not|contraindicated|prohibit)\b/i.test(text)) return 'avoid';
  if (/\b(increas|elevat|rais|enhanc|potentiat|higher)\b/i.test(text)) return 'increase';
  if (/\b(decreas|reduc|lower|diminish|impair|inhibit)\b/i.test(text)) return 'decrease';
  return 'modify';
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'SPH-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

// ===== QA Report Generation =====
function generateQAReport(label, claims) {
  const issues = [];

  // 1. Check if Drug Interactions section exists
  if (!label.drug_interactions) {
    issues.push({
      severity: 'high',
      title: 'Missing Drug Interactions Section',
      description: 'No "Drug Interactions" section found in the label. FDA labeling requirements (21 CFR 201.57) require disclosure of clinically significant interactions, including food effects.',
    });
  }

  // 2. Check for food mentions in Drug Interactions
  const diText = getSectionText(label, 'drug_interactions');
  const daClaims = claims.filter((c) => c.sectionKey === 'dosage_and_administration');
  const diClaims = claims.filter((c) => c.sectionKey === 'drug_interactions');
  const cpClaims = claims.filter((c) => c.sectionKey === 'clinical_pharmacology');

  if (diText && diClaims.length === 0) {
    issues.push({
      severity: 'medium',
      title: 'No Food Interactions Detected in Drug Interactions Section',
      description: 'The Drug Interactions section exists but no food-related interaction claims were extracted. This may indicate food interactions are not clinically significant for this drug, or they may be described using uncommon terminology.',
    });
  }

  // 3. Cross-section consistency: food instructions in Dosage but not in Drug Interactions
  if (daClaims.length > 0 && diClaims.length === 0) {
    issues.push({
      severity: 'medium',
      title: 'Food Instructions in Dosage but Not in Drug Interactions',
      description: 'Food-related dosing instructions found in Dosage & Administration but no corresponding claims in Drug Interactions. Consider cross-referencing for label consistency.',
    });
  }

  // 4. PK data in Clinical Pharmacology without dosing guidance
  if (cpClaims.length > 0 && daClaims.length === 0) {
    issues.push({
      severity: 'low',
      title: 'Food-Effect PK Data Without Dosing Instructions',
      description: 'Clinical Pharmacology section mentions food effects on pharmacokinetics but Dosage & Administration does not include corresponding food-timing instructions.',
    });
  }

  // 5. Check for potential contradictions
  const foodsInDI = new Set(diClaims.map((c) => c.foodTrigger.toLowerCase()));
  const foodsInDA = new Set(daClaims.map((c) => c.foodTrigger.toLowerCase()));
  const sharedFoods = [...foodsInDI].filter((f) => foodsInDA.has(f));

  sharedFoods.forEach((food) => {
    const diDir = diClaims.find((c) => c.foodTrigger.toLowerCase() === food)?.direction;
    const daDir = daClaims.find((c) => c.foodTrigger.toLowerCase() === food)?.direction;

    if (diDir && daDir && diDir !== daDir) {
      issues.push({
        severity: 'high',
        title: `Potential Contradiction: "${food}"`,
        description: `Drug Interactions section suggests "${diDir}" but Dosage & Administration suggests "${daDir}" for "${food}". Manual review recommended.`,
      });
    }
  });

  // 6. Label status warning
  issues.push({
    severity: 'info',
    title: 'Label Provenance Notice',
    description: 'Data sourced from openFDA, which notes content may differ from FDA-approved labeling. DailyMed warns "in-use" labeling may not be verified by FDA. Always confirm against official sources for regulatory decisions.',
  });

  // Counts
  const sectionsChecked = LABEL_SECTIONS.filter((s) => label[s.key]).length;
  const foodClaimCount = claims.length;
  const uniqueFoods = new Set(claims.map((c) => c.foodTrigger.toLowerCase())).size;

  return {
    issues,
    metrics: {
      sectionsChecked,
      foodClaimCount,
      uniqueFoods,
      issueCount: issues.filter((i) => i.severity !== 'info').length,
    },
  };
}

function getSectionText(label, key) {
  const raw = label[key];
  if (!raw) return '';
  const text = Array.isArray(raw) ? raw.join('\n') : String(raw);
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ===== Rendering =====
function renderDrugInfo(label) {
  const name = label.openfda?.brand_name?.[0] || label.openfda?.generic_name?.[0] || 'Unknown Drug';
  const generic = label.openfda?.generic_name?.[0] || '';
  const manufacturer = label.openfda?.manufacturer_name?.[0] || 'Unknown manufacturer';
  const setId = label.set_id || 'N/A';
  const effectiveDate = label.effective_time
    ? `${label.effective_time.substring(0, 4)}-${label.effective_time.substring(4, 6)}-${label.effective_time.substring(6, 8)}`
    : 'N/A';

  document.getElementById('drug-name').textContent = name;
  document.getElementById('drug-meta').innerHTML =
    `${generic ? `<strong>Generic:</strong> ${generic} · ` : ''}` +
    `<strong>Mfr:</strong> ${manufacturer} · ` +
    `<strong>Set ID:</strong> <code>${setId}</code> · ` +
    `<strong>Effective:</strong> ${effectiveDate}`;
}

function renderQAReport(qa) {
  const statsEl = document.getElementById('qa-stats');
  const issuesEl = document.getElementById('qa-issues');

  statsEl.innerHTML = `
    <div class="qa-stat">
      <div class="qa-stat-num info">${qa.metrics.sectionsChecked}</div>
      <div class="qa-stat-label">Sections Analyzed</div>
    </div>
    <div class="qa-stat">
      <div class="qa-stat-num ${qa.metrics.foodClaimCount > 0 ? 'good' : 'warn'}">${qa.metrics.foodClaimCount}</div>
      <div class="qa-stat-label">FDI Claims Found</div>
    </div>
    <div class="qa-stat">
      <div class="qa-stat-num ${qa.metrics.uniqueFoods > 0 ? 'good' : 'warn'}">${qa.metrics.uniqueFoods}</div>
      <div class="qa-stat-label">Unique Food Triggers</div>
    </div>
    <div class="qa-stat">
      <div class="qa-stat-num ${qa.metrics.issueCount > 0 ? 'bad' : 'good'}">${qa.metrics.issueCount}</div>
      <div class="qa-stat-label">QA Issues</div>
    </div>
  `;

  issuesEl.innerHTML = qa.issues.map((issue) => `
    <div class="qa-issue qa-issue--${issue.severity}">
      <span class="issue-severity ${issue.severity}">${issue.severity}</span>
      <div class="issue-body">
        <h4>${issue.title}</h4>
        <p>${issue.description}</p>
      </div>
    </div>
  `).join('');
}

function renderClaims(claims) {
  const listEl = document.getElementById('claims-list');

  if (claims.length === 0) {
    listEl.innerHTML = `
      <div class="no-results">
        <p>No food–drug interaction claims were extracted from this label. This may indicate food interactions are not clinically significant for this drug, or the extraction patterns did not match the label's terminology.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = claims.map((claim) => `
    <div class="claim-card" id="${claim.id}">
      <div class="claim-header">
        <span class="claim-food">🍽️ ${escapeHtml(claim.foodTrigger)}</span>
        <span class="claim-direction ${claim.direction}">${claim.direction}</span>
      </div>
      <div class="claim-text">${highlightFoodTerms(escapeHtml(truncate(claim.sentence, 300)))}</div>
      <div class="claim-provenance">
        <div class="prov-item">
          <span class="prov-label">Section:</span>
          <span class="prov-value">${claim.section}</span>
        </div>
        <div class="prov-item">
          <span class="prov-label">LOINC:</span>
          <span class="prov-value">${claim.sectionLOINC}</span>
        </div>
        <div class="prov-item">
          <span class="prov-label">Hash:</span>
          <span class="prov-value">${claim.snippetHash}</span>
        </div>
        <div class="prov-item">
          <span class="prov-label">Method:</span>
          <span class="prov-value">${claim.method}</span>
        </div>
        <div class="prov-item">
          <span class="prov-label">Status:</span>
          <span class="prov-value">${claim.labelStatus}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSections(label) {
  const tabsEl = document.getElementById('section-tabs');
  const contentEl = document.getElementById('section-content');

  const availableSections = LABEL_SECTIONS.filter((s) => label[s.key]);

  if (availableSections.length === 0) {
    tabsEl.innerHTML = '';
    contentEl.innerHTML = '<p>No relevant label sections available.</p>';
    return;
  }

  tabsEl.innerHTML = availableSections.map((sec, i) => `
    <button class="section-tab ${i === 0 ? 'active' : ''}" data-section="${sec.key}">${sec.label}</button>
  `).join('');

  // Show first section
  showSection(availableSections[0].key, label);

  // Tab click handlers
  tabsEl.querySelectorAll('.section-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.section-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      showSection(tab.dataset.section, label);
    });
  });
}

function showSection(key, label) {
  const contentEl = document.getElementById('section-content');
  const raw = label[key];
  if (!raw) {
    contentEl.innerHTML = '<p>Section not available.</p>';
    return;
  }

  let text = Array.isArray(raw) ? raw.join('\n\n') : String(raw);
  // Clean up HTML but keep some structure
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  contentEl.innerHTML = highlightFoodTerms(escapeHtml(text));
}

// ===== Utility Functions =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function highlightFoodTerms(text) {
  const terms = FOOD_TRIGGERS
    .map((t) => t.term)
    .sort((a, b) => b.length - a.length); // Longer terms first

  let result = text;
  terms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    result = result.replace(regex, '<span class="food-highlight">$1</span>');
  });
  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function truncate(str, len) {
  if (str.length <= len) return str;
  return str.substring(0, len) + '…';
}

// ===== UI State =====
function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('search-btn').disabled = true;
  document.getElementById('search-btn').textContent = 'Searching…';
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('search-btn').disabled = false;
  document.getElementById('search-btn').textContent = 'Search';
}

function showResults() {
  document.getElementById('results-container').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
}

function showNoResults(query, error) {
  hideLoading();
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('empty-state').classList.remove('hidden');

  const emptyEl = document.getElementById('empty-state');
  emptyEl.querySelector('h3').textContent = error
    ? 'Search Error'
    : `No results for "${query}"`;
  emptyEl.querySelector('p').textContent = error
    ? `Error: ${error}. Please try again.`
    : 'Try a different drug name or check the spelling. Use the quick search buttons for known drugs with food interactions.';
}

// ===== Export Functions =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('export-json-btn')?.addEventListener('click', exportJSON);
  document.getElementById('export-report-btn')?.addEventListener('click', exportReport);
});

function exportJSON() {
  if (!currentClaims.length) return;

  const exportData = {
    exportedAt: new Date().toISOString(),
    source: 'openFDA Drug Labeling API',
    disclaimer: 'Data sourced from openFDA (CC0). Not for clinical decision-making. Labels may differ from FDA-approved labeling.',
    drug: {
      brandName: currentDrugData?.openfda?.brand_name?.[0] || 'Unknown',
      genericName: currentDrugData?.openfda?.generic_name?.[0] || 'Unknown',
      setId: currentDrugData?.set_id || 'N/A',
      effectiveTime: currentDrugData?.effective_time || 'N/A',
    },
    claims: currentClaims,
    qaReport: currentQA,
  };

  downloadFile(
    JSON.stringify(exportData, null, 2),
    `fdi-claims-${exportData.drug.genericName.toLowerCase().replace(/\s+/g, '-')}.json`,
    'application/json'
  );
}

function exportReport() {
  if (!currentQA) return;

  const drugName = currentDrugData?.openfda?.brand_name?.[0] || 'Unknown Drug';
  const generic = currentDrugData?.openfda?.generic_name?.[0] || '';

  let report = `FDI LABEL QA REPORT\n`;
  report += `${'='.repeat(60)}\n\n`;
  report += `Drug: ${drugName} (${generic})\n`;
  report += `Set ID: ${currentDrugData?.set_id || 'N/A'}\n`;
  report += `Effective: ${currentDrugData?.effective_time || 'N/A'}\n`;
  report += `Report Generated: ${new Date().toISOString()}\n`;
  report += `Source: openFDA Drug Labeling API (CC0)\n\n`;

  report += `METRICS\n${'-'.repeat(40)}\n`;
  report += `Sections Analyzed: ${currentQA.metrics.sectionsChecked}\n`;
  report += `FDI Claims Found:  ${currentQA.metrics.foodClaimCount}\n`;
  report += `Unique Foods:      ${currentQA.metrics.uniqueFoods}\n`;
  report += `QA Issues:         ${currentQA.metrics.issueCount}\n\n`;

  report += `QA ISSUES\n${'-'.repeat(40)}\n`;
  currentQA.issues.forEach((issue, i) => {
    report += `\n[${issue.severity.toUpperCase()}] ${issue.title}\n`;
    report += `${issue.description}\n`;
  });

  report += `\n\nEXTRACTED CLAIMS\n${'-'.repeat(40)}\n`;
  currentClaims.forEach((claim, i) => {
    report += `\nClaim ${i + 1}: ${claim.foodTrigger} (${claim.direction})\n`;
    report += `Section: ${claim.section} (LOINC ${claim.sectionLOINC})\n`;
    report += `Hash: ${claim.snippetHash}\n`;
    report += `Text: ${truncate(claim.sentence, 200)}\n`;
  });

  report += `\n\nDISCLAIMER\n${'-'.repeat(40)}\n`;
  report += `This report is generated from openFDA data which is CC0 public domain.\n`;
  report += `openFDA cautions not to rely on results for medical-care decisions.\n`;
  report += `DailyMed warns "in-use" labeling may not match FDA-approved labeling.\n`;
  report += `Always verify against official FDA sources for regulatory decisions.\n`;

  downloadFile(
    report,
    `fdi-qa-report-${generic.toLowerCase().replace(/\s+/g, '-')}.txt`,
    'text/plain'
  );
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
