# AI Mechanical Safety Compliance Advisor

An AI-powered agent built on **IBM Granite** (`ibm/granite-4-h-small`) via **watsonx.ai** that provides expert mechanical safety compliance advisory, hazard analysis, and standards guidance.

---

## Features

- **Hazard Identification** — Identifies mechanical, electrical, thermal, noise/vibration, ergonomic, and chemical hazards
- **Standards Reference** — ISO 12100, ISO 13849, IEC 62061, ISO 13857, ISO 14119, IEC 60204-1, OSHA 29 CFR 1910, EU Machinery Directive, ANSI B11
- **Risk Assessment Guidance** — Walks through the ISO 12100 3-step risk reduction methodology
- **Performance Level (PL) & SIL Determination** — Guides functional safety assessments per ISO 13849 / IEC 62061
- **Compliance Checklist** — 20-item structured checklist with critical vs. recommended items
- **Multi-turn Conversation** — Session-aware chat with conversation history
- **Web Dashboard UI** — Interactive browser-based interface with 4 tabs: Chat, Compliance Summary, Checklist, Hazard Library
- **REST API** — Express server with clean endpoints for integration
- **CLI Interface** — Terminal-based interactive advisor

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root with your IBM watsonx.ai credentials:

```env
WATSONX_API_KEY=your_api_key_here
WATSONX_URL=https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/YOUR_INSTANCE_ID
WATSONX_MODEL_ID=ibm/granite-4-h-small
WATSONX_PROJECT_ID=your_project_id_here
IAM_TOKEN_URL=https://iam.cloud.ibm.com/identity/token
PORT=3000
```

### 3. Start the server

```bash
npm start
# or for hot-reload during development:
npm run dev
```

Open **http://localhost:3000** in your browser.

### 4. CLI Mode

```bash
npm run cli
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check |
| `POST` | `/api/query` | Chat with the advisor |
| `POST` | `/api/compliance-summary` | Full compliance assessment for machinery |
| `GET`  | `/api/standards` | List all known standards |
| `GET`  | `/api/hazards` | List all hazard categories |
| `GET`  | `/api/checklist` | Full compliance checklist |
| `DELETE` | `/api/session/:id` | Clear a conversation session |

### Example — Chat Query

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the main hazards of a CNC milling machine?"}'
```

### Example — Compliance Assessment

```bash
curl -X POST http://localhost:3000/api/compliance-summary \
  -H "Content-Type: application/json" \
  -d '{"machinery": "5-axis CNC machining centre with ATC, 18.5 kW, 12000 RPM"}'
```

---

## Project Structure

```
├── src/
│   ├── config.js         – Configuration (reads from .env)
│   ├── watsonx.js        – IBM watsonx.ai API client (IAM auth + text generation)
│   ├── knowledgeBase.js  – Mechanical safety standards, hazards & checklists
│   ├── agent.js          – Core AI agent orchestration
│   ├── server.js         – Express REST API server
│   └── cli.js            – Interactive terminal CLI
├── public/
│   └── index.html        – Web dashboard UI
├── package.json
└── README.md
```

---

## Standards Covered

| Standard | Title |
|----------|-------|
| ISO 12100:2010 | Safety of machinery — General principles for design |
| ISO 13849-1:2023 | Safety-related parts of control systems |
| IEC 62061:2021 | Functional safety of safety-related control systems |
| ISO 13857:2019 | Safety distances |
| ISO 14119:2013 | Interlocking devices |
| IEC 60204-1 | Electrical equipment of machines |
| 2006/42/EC | EU Machinery Directive |
| OSHA 29 CFR 1910 Subpart O | Machinery and Machine Guarding (USA) |
| ANSI B11 Series | Machine Safety Standards (USA) |

---

## Disclaimer

This AI advisor provides guidance based on embedded standards knowledge and IBM Granite AI generation. For critical safety decisions, always engage a **certified safety engineer** and conduct a formal risk assessment per applicable standards.
