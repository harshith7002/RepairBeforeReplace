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

- **Framework:** Next.js 14 (App Router) & React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Animation:** Framer Motion & CSS SVG Telemetry Streams
