/**
 * Express REST API Server
 * Exposes the AI Safety Compliance Advisor as HTTP endpoints.
 */

require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');
const { v4: uuidv4 } = require('uuid');

const config  = require('./config');
const agent   = require('./agent');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    agent:     config.agent.name,
    model:     config.watsonx.modelId,
    timestamp: new Date().toISOString(),
  });
});

// ─── POST /api/query ──────────────────────────────────────────────────────────
/**
 * Body: { query: string, sessionId?: string }
 * Returns full agent response with standards, hazards, optional checklist.
 */
app.post('/api/query', async (req, res) => {
  const { query, sessionId } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'query is required and must be a non-empty string.' });
  }

  const sid = sessionId || uuidv4();

  try {
    const result = await agent.processQuery(query.trim(), sid);
    res.json({ ...result, sessionId: sid });
  } catch (err) {
    console.error('[POST /api/query]', err.message);
    res.status(500).json({ error: 'Internal server error. Please try again.', details: err.message });
  }
});

// ─── POST /api/compliance-summary ────────────────────────────────────────────
/**
 * Body: { machinery: string, sessionId?: string }
 */
app.post('/api/compliance-summary', async (req, res) => {
  const { machinery, sessionId } = req.body;

  if (!machinery || !machinery.trim()) {
    return res.status(400).json({ error: 'machinery description is required.' });
  }

  const sid = sessionId || uuidv4();

  try {
    const result = await agent.getComplianceSummary(machinery.trim(), sid);
    res.json({ ...result, sessionId: sid });
  } catch (err) {
    console.error('[POST /api/compliance-summary]', err.message);
    res.status(500).json({ error: 'Internal server error.', details: err.message });
  }
});

// ─── GET /api/standards ───────────────────────────────────────────────────────
app.get('/api/standards', (_req, res) => {
  const { STANDARDS } = require('./knowledgeBase');
  res.json({ standards: Object.values(STANDARDS) });
});

// ─── GET /api/hazards ─────────────────────────────────────────────────────────
app.get('/api/hazards', (_req, res) => {
  const { HAZARD_CATEGORIES } = require('./knowledgeBase');
  res.json({ hazardCategories: Object.values(HAZARD_CATEGORIES) });
});

// ─── GET /api/checklist ───────────────────────────────────────────────────────
app.get('/api/checklist', (_req, res) => {
  const { COMPLIANCE_CHECKLIST } = require('./knowledgeBase');
  res.json({ checklist: COMPLIANCE_CHECKLIST, total: COMPLIANCE_CHECKLIST.length });
});

// ─── DELETE /api/session/:id ──────────────────────────────────────────────────
app.delete('/api/session/:id', (req, res) => {
  agent.clearSession(req.params.id);
  res.json({ message: `Session ${req.params.id} cleared.` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.server.port, () => {
  console.log(`\n╔═══════════════════════════════════════════════════════╗`);
  console.log(`║   AI Mechanical Safety Compliance Advisor             ║`);
  console.log(`║   Server running on http://localhost:${config.server.port}           ║`);
  console.log(`║   Model: ${config.watsonx.modelId.padEnd(43)}║`);
  console.log(`╚═══════════════════════════════════════════════════════╝\n`);
  console.log('Available endpoints:');
  console.log(`  GET  /          → Web Dashboard UI`);
  console.log(`  GET  /health    → Health check`);
  console.log(`  POST /api/query → Chat with the advisor`);
  console.log(`  POST /api/compliance-summary → Full compliance assessment`);
  console.log(`  GET  /api/standards → All known standards`);
  console.log(`  GET  /api/hazards   → All hazard categories`);
  console.log(`  GET  /api/checklist → Compliance checklist\n`);
});

module.exports = app;
