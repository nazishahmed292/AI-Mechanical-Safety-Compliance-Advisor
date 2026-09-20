/**
 * AI Mechanical Safety Compliance Advisor — Core Agent
 * Orchestrates conversation, tool selection, and LLM calls.
 */

const { generateText }        = require('./watsonx');
const { buildKnowledgeContext, COMPLIANCE_CHECKLIST, searchStandards, searchHazards } = require('./knowledgeBase');

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert AI Mechanical Safety Compliance Advisor with deep knowledge in:
- International safety standards (ISO 12100, ISO 13849, IEC 62061, ISO 13857, ISO 14119, ISO 13850, IEC 60204-1)
- Regional regulations (EU Machinery Directive 2006/42/EC, OSHA 29 CFR 1910, ANSI B11 series)
- Mechanical hazard identification and risk assessment methodologies
- Safety control system design (Performance Level, SIL determination)
- Machine guarding, safeguarding devices, and safety distances
- Lockout/tagout (LOTO) procedures and maintenance safety
- CE marking and technical documentation requirements

Your role:
1. Identify mechanical hazards from user descriptions
2. Map hazards to applicable standards and regulations
3. Recommend specific compliance measures with standard references
4. Assess risk levels and suggest risk reduction hierarchy (ISO 12100 3-step method)
5. Provide actionable compliance checklists
6. Explain technical requirements in clear, practical language

Always:
- Cite specific standards and clause numbers where applicable
- Distinguish between mandatory requirements and best practices
- Recommend professional validation by a certified safety engineer for critical systems
- Structure responses clearly with hazard analysis, applicable standards, and recommended actions

Respond professionally, technically accurately, and concisely.`;

// ─── Session Store ────────────────────────────────────────────────────────────
const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { history: [], createdAt: new Date().toISOString() });
  }
  return sessions.get(sessionId);
}

function clearSession(sessionId) {
  sessions.delete(sessionId);
}

// ─── Intent Detection ─────────────────────────────────────────────────────────
function detectIntent(query) {
  const q = query.toLowerCase();
  if (/checklist|audit|inspect/.test(q))          return 'CHECKLIST';
  if (/standard|regulation|iso|iec|osha|ansi|directive/.test(q)) return 'STANDARDS_LOOKUP';
  if (/hazard|danger|risk/.test(q))               return 'HAZARD_ANALYSIS';
  if (/guard|safeguard|fence|barrier/.test(q))    return 'GUARDING';
  if (/loto|lockout|tagout|isolation/.test(q))    return 'LOTO';
  if (/pl|performance level|sil|safety integrity/.test(q)) return 'FUNCTIONAL_SAFETY';
  if (/ce mark|declaration|technical file/.test(q)) return 'CERTIFICATION';
  if (/noise|vibration|decibel|dba/.test(q))      return 'NOISE_VIBRATION';
  if (/ergon|posture|lifting|manual handling/.test(q)) return 'ERGONOMICS';
  return 'GENERAL';
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────
function buildPrompt(userQuery, history, knowledgeContext) {
  const historyText = history
    .slice(-6) // last 3 turns
    .map(h => `${h.role === 'user' ? 'Human' : 'Advisor'}: ${h.content}`)
    .join('\n');

  return `${SYSTEM_PROMPT}

${knowledgeContext}

${historyText ? `### Conversation History:\n${historyText}\n` : ''}
Human: ${userQuery}
Advisor:`;
}

// ─── Checklist Handler ────────────────────────────────────────────────────────
function generateChecklist(query) {
  const q = query.toLowerCase();
  let items = COMPLIANCE_CHECKLIST;

  if (/guard|safeguard/.test(q))      items = items.filter(i => i.category === 'Guards & Safeguards');
  else if (/control|pl|sil/.test(q))  items = items.filter(i => i.category === 'Control Systems');
  else if (/electr|loto/.test(q))     items = items.filter(i => i.category === 'Electrical Safety');
  else if (/doc|ce|declaration/.test(q)) items = items.filter(i => i.category === 'Documentation');
  else if (/noise|vibrat/.test(q))    items = items.filter(i => i.category === 'Noise & Vibration');

  return items;
}

// ─── Main Query Handler ───────────────────────────────────────────────────────
async function processQuery(userQuery, sessionId = 'default') {
  const session = getSession(sessionId);
  const intent  = detectIntent(userQuery);

  // Enrich with knowledge base context
  const knowledgeContext = buildKnowledgeContext(userQuery);

  // Add user message to history
  session.history.push({ role: 'user', content: userQuery });

  let responseText;
  let checklist = null;
  let matchedStandards = [];
  let matchedHazards   = [];

  try {
    // For checklist intent, also compute structured checklist
    if (intent === 'CHECKLIST') {
      checklist = generateChecklist(userQuery);
    }

    // Look up relevant standards / hazards for structured response
    matchedStandards = searchStandards(userQuery);
    matchedHazards   = searchHazards(userQuery);

    const prompt = buildPrompt(userQuery, session.history.slice(0, -1), knowledgeContext);
    responseText  = await generateText(prompt);

  } catch (err) {
    console.error('[Agent] LLM call failed:', err.message);
    responseText = buildFallbackResponse(intent, userQuery, matchedStandards, matchedHazards);
  }

  // Save assistant response to history
  session.history.push({ role: 'assistant', content: responseText });

  return {
    sessionId,
    intent,
    response: responseText,
    checklist:        checklist  || null,
    relatedStandards: matchedStandards.map(s => ({ id: s.id, title: s.title })),
    relatedHazards:   matchedHazards.map(h => h.name),
    timestamp:        new Date().toISOString(),
  };
}

// ─── Fallback (LLM unavailable) ───────────────────────────────────────────────
function buildFallbackResponse(intent, query, standards, hazards) {
  const stdList = standards.length
    ? standards.map(s => `• ${s.id}: ${s.title}`).join('\n')
    : '• ISO 12100 (Risk Assessment)\n• ISO 13849 (Control Systems)\n• IEC 62061 (Functional Safety)';

  return `**Safety Compliance Advisory — Knowledge-Base Response**

Based on your query regarding: "${query}"

**Applicable Standards:**
${stdList}

**Recommended Actions (ISO 12100 — 3-Step Method):**
1. **Inherently safe design** — Eliminate or reduce hazards by design (geometry, materials, forces)
2. **Safeguarding & protective measures** — Guards, interlocks, safety distances, protective devices
3. **Information for use** — Warning signs, operator training, PPE requirements, safe work procedures

${hazards.length ? `**Identified Hazard Categories:** ${hazards.map(h => h.name).join(', ')}\n` : ''}

⚠️ *This advisory is based on the embedded knowledge base. For critical safety decisions, always engage a certified safety engineer and conduct a formal risk assessment.*`;
}

// ─── Compliance Summary ───────────────────────────────────────────────────────
async function getComplianceSummary(machineryDescription, sessionId = 'default') {
  const summaryQuery = `Provide a comprehensive mechanical safety compliance assessment for the following machinery/equipment: "${machineryDescription}". Include: 1) Main hazard categories present, 2) Applicable standards and directives, 3) Critical compliance requirements, 4) Risk reduction recommendations, 5) Documentation requirements.`;
  return processQuery(summaryQuery, sessionId);
}

module.exports = { processQuery, getComplianceSummary, clearSession, getSession };
