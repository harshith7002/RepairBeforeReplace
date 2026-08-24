# RepairBeforeReplace

> **Don't replace it. Diagnose it.**
> 
> *“We built AI that tells you when NOT to buy something.”*

---

## 🛠️ About RepairBeforeReplace

**RepairBeforeReplace** is an AI-powered visual repair assistant and hardware telemetry workstation designed to help consumers and technicians determine whether a broken physical object can be repaired before replacing or discarding it.

By analyzing photos or videos of damaged physical objects, RepairBeforeReplace extracts computer-vision feature maps, identifies likely failure modes, calculates transparent repairability scores (0–100), provides step-by-step interactive repair guides, and quantifies financial savings and environmental e-waste reduction.

---

## 🌟 Key Features

- **Full Desktop Diagnostic Workstation:** Intelligent 1200px–1500px multi-panel hardware diagnostic interface avoiding narrow mobile-first columns.
- **Visual Telemetry & Component Detection:** Annotated SVG bounding box overlay (`MOTOR AREA`, `DRAIN PUMP`, `DRUM BEARING`, `DRAIN PATH`) with Original ↔ AI Analysis view toggle.
- **Repairability Score Engine (0–100):** Transparent evaluation incorporating parts availability, repair complexity, cost ratio, and product accessibility.
- **Economic Cost Comparison:** Direct savings calculation comparing DIY repair costs against new unit replacement prices.
- **Interactive Step-by-Step Repair Guide:** 5-step interactive manual with safety prerequisite checklists, required hand tools, and visual step target diagrams.
- **Hardware Knowledge Library & Diagnosis Audit History:** Searchable index across 6 physical categories (*Appliances, Electronics, Bicycles, Tools, Mechanical, Furniture*) with persistent audit logs.
- **Zero-Setup Hackathon Judge Demo (`/demo`):** 90-second automated walk-through demonstrating full diagnostic telemetry on a front-loading washing machine.

---

## 🧠 Backend

RepairBeforeReplace now ships with a real, working backend — uploads, diagnoses, and
history all persist across restarts, with no external database or extra services to
stand up.

- **Storage:** every diagnosis is written to `data/diagnostics.json` (auto-created and
  seeded with the four original demo items on first run). Uploaded photos are saved to
  `public/uploads/`. Both are gitignored — they're your local runtime data.
- **API routes** (`src/app/api/**`):
  - `POST /api/diagnose` — upload a photo (`multipart/form-data`, field `image`, plus
    optional `category` and `notes`), get back a full diagnosis.
  - `GET /api/diagnostics` — list history (`?category=`, `?search=`, `?limit=`).
  - `GET /api/diagnostics/:id` — fetch one record.
  - `PATCH /api/diagnostics/:id` — save repair-guide progress (`{ completedSteps }`).
  - `DELETE /api/diagnostics/:id` — remove a record (and its uploaded photo, if local).
  - `GET /api/stats` — aggregate totals (savings, CO₂, materials) across all diagnoses.
- **Diagnosis engine** (`src/server/`): every upload is run through
  `runDiagnosis()`, which tries a real AI vision call first (see below) and always has a
  deterministic, dependency-free knowledge-base engine (`heuristicEngine.ts` +
  `knowledgeBase.ts`, 12 hand-authored failure profiles across all 6 categories) as a
  guaranteed fallback — so the app is fully functional with zero configuration.

### Optional: real AI vision diagnosis

Set an Anthropic API key and every upload is diagnosed by an actual vision-capable
Claude model instead of the knowledge-base engine:

```bash
cp .env.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...
```

No key needed to run the app — this is purely additive. When it's set, diagnoses are
tagged "AI Vision Diagnosis" in the UI; without it, they're tagged "Knowledge-Base
Match". `ANTHROPIC_MODEL` can override the default model.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/harshith7002/RepairBeforeReplace.git
cd RepairBeforeReplace
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 💻 Tech Stack

- **Framework:** Next.js 14 (App Router, Route Handlers) & React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Animation:** Framer Motion & CSS SVG Telemetry Streams
- **Backend:** Next.js Route Handlers + a file-backed JSON store — no external DB
- **AI (optional):** Anthropic Claude vision API, called directly via `fetch` (no SDK dependency)
