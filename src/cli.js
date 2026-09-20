/**
 * Interactive CLI for the AI Mechanical Safety Compliance Advisor
 * Run: node src/cli.js
 */

require('dotenv').config();
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
const agent = require('./agent');

const SESSION_ID = uuidv4();

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

function printBanner() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║        AI MECHANICAL SAFETY COMPLIANCE ADVISOR              ║');
  console.log('║        Powered by IBM Granite via watsonx.ai                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\nWelcome! I can help you with:');
  console.log('  • Hazard identification & risk assessment (ISO 12100)');
  console.log('  • Machine guarding & safety distances (ISO 13857, ISO 14119)');
  console.log('  • Safety control systems & Performance Level (ISO 13849)');
  console.log('  • Functional safety & SIL determination (IEC 62061)');
  console.log('  • LOTO / isolation procedures');
  console.log('  • CE marking & documentation (EU Machinery Directive)');
  console.log('  • OSHA & ANSI compliance (US regulations)');
  console.log('\nSpecial commands:');
  console.log('  checklist   → Show full compliance checklist');
  console.log('  standards   → List all known standards');
  console.log('  hazards     → List all hazard categories');
  console.log('  clear       → Clear conversation history');
  console.log('  exit / quit → Exit the advisor');
  console.log('\n' + '─'.repeat(66) + '\n');
}

function printStandards() {
  const { STANDARDS } = require('./knowledgeBase');
  console.log('\n📋 Known Mechanical Safety Standards:');
  Object.values(STANDARDS).forEach(s => {
    console.log(`  • ${s.id} — ${s.title}`);
  });
  console.log();
}

function printHazards() {
  const { HAZARD_CATEGORIES } = require('./knowledgeBase');
  console.log('\n⚠️  Hazard Categories:');
  Object.values(HAZARD_CATEGORIES).forEach(h => {
    console.log(`  • ${h.name}: ${h.types.slice(0, 3).join(', ')}...`);
  });
  console.log();
}

function printChecklist() {
  const { COMPLIANCE_CHECKLIST } = require('./knowledgeBase');
  console.log('\n✅ Compliance Checklist:');
  const categories = [...new Set(COMPLIANCE_CHECKLIST.map(i => i.category))];
  categories.forEach(cat => {
    console.log(`\n  [${cat}]`);
    COMPLIANCE_CHECKLIST
      .filter(i => i.category === cat)
      .forEach(i => {
        const marker = i.critical ? '🔴' : '🟡';
        console.log(`    ${marker} ${i.id}: ${i.item}`);
      });
  });
  console.log('\n  🔴 Critical   🟡 Recommended\n');
}

async function askQuestion(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  printBanner();

  while (true) {
    const userInput = (await askQuestion('You: ')).trim();

    if (!userInput) continue;

    const lower = userInput.toLowerCase();

    if (lower === 'exit' || lower === 'quit') {
      console.log('\nAdvisor: Thank you for using the AI Mechanical Safety Compliance Advisor. Stay safe!\n');
      rl.close();
      process.exit(0);
    }

    if (lower === 'standards') { printStandards(); continue; }
    if (lower === 'hazards')   { printHazards();   continue; }
    if (lower === 'checklist') { printChecklist();  continue; }

    if (lower === 'clear') {
      const { clearSession } = require('./agent');
      clearSession(SESSION_ID);
      console.log('\nAdvisor: Conversation history cleared.\n');
      continue;
    }

    console.log('\nAdvisor: Analyzing your query...\n');

    try {
      const result = await agent.processQuery(userInput, SESSION_ID);

      console.log('─'.repeat(66));
      console.log(`\n${result.response}\n`);

      if (result.relatedStandards.length > 0) {
        console.log('📌 Related Standards: ' + result.relatedStandards.map(s => s.id).join(' | '));
      }
      if (result.relatedHazards.length > 0) {
        console.log('⚠️  Hazard Categories: ' + result.relatedHazards.join(' | '));
      }
      if (result.checklist) {
        console.log(`\n✅ Compliance Items (${result.checklist.length}):`);
        result.checklist.forEach(i => {
          const m = i.critical ? '[CRITICAL]' : '[RECOMMENDED]';
          console.log(`  ${m} ${i.id}: ${i.item}`);
        });
      }
      console.log('─'.repeat(66) + '\n');

    } catch (err) {
      console.error('\n⚠️  Error:', err.message, '\n');
    }
  }
}

main();
