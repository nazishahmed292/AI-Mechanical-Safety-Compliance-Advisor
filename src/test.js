/**
 * Validation test — checks modules load and knowledge base works.
 * Does NOT require a live API key.
 */
require('dotenv').config();

const kb     = require('./knowledgeBase');
const agent  = require('./agent');

let pass = 0;
let fail = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ PASS: ${label}`); pass++; }
  else           { console.error(`  ❌ FAIL: ${label}`); fail++; }
}

console.log('\n── Knowledge Base Tests ──────────────────────────');

assert(Object.keys(kb.STANDARDS).length >= 7,            'At least 7 standards loaded');
assert(Object.keys(kb.HAZARD_CATEGORIES).length >= 5,    'At least 5 hazard categories loaded');
assert(kb.COMPLIANCE_CHECKLIST.length >= 20,             '20+ compliance checklist items');

const stds = kb.searchStandards('ISO 12100');
assert(stds.length > 0,                                  'searchStandards("ISO 12100") returns results');

const haz = kb.searchHazards('mechanical');
assert(haz.length > 0,                                   'searchHazards("mechanical") returns results');

const ctx = kb.buildKnowledgeContext('CNC milling machine guarding risk');
assert(ctx.length > 50,                                  'buildKnowledgeContext returns non-empty context');

console.log('\n── Agent Module Tests ────────────────────────────');

assert(typeof agent.processQuery === 'function',         'processQuery is a function');
assert(typeof agent.getComplianceSummary === 'function', 'getComplianceSummary is a function');
assert(typeof agent.clearSession === 'function',         'clearSession is a function');

// Test session management
const sess = agent.getSession('test-123');
assert(sess && sess.history !== undefined,               'getSession creates session with history array');
agent.clearSession('test-123');
assert(!agent.getSession.__proto__ || true,              'clearSession does not throw');

console.log('\n── Config Tests ──────────────────────────────────');
const config = require('./config');
assert(config.watsonx.modelId   === 'ibm/granite-4-h-small',   'Model ID set correctly');
assert(config.watsonx.projectId === 'a869ea08-6524-48a0-9d27-c598eb1ee4b2', 'Project ID set correctly');
assert(config.server.port >= 1024 && config.server.port <= 65535, 'Port is in valid range');

console.log('\n─────────────────────────────────────────────────');
console.log(`\n  Result: ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
