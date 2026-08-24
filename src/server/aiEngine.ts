import { CATEGORIES, FAILURE_PROFILES } from './knowledgeBase';
import { formatINR, parseINR } from './parseCurrency';
import { DiagnoseInput, GeneratedDiagnosis } from './heuristicEngine';
import {
  ComponentMarker,
  DiagnosticCategory,
  ImpactMetrics,
  RepairStep,
  SecondaryPossibility,
} from '../types';

/**
 * Optional real AI vision diagnosis, used only when ANTHROPIC_API_KEY is set in the
 * environment. Talks to the Anthropic Messages API directly over fetch (no SDK
 * dependency needed — Next.js already ships a Node runtime with a global fetch), sending
 * the uploaded photo plus a strict JSON-output prompt. Any failure — missing key, network
 * error, malformed response — resolves to `null` so the caller can fall back to the
 * deterministic heuristic engine and the app keeps working with zero configuration.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const REQUEST_TIMEOUT_MS = 30000;

export function isAiEngineAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function buildPrompt(notes?: string, categoryHint?: string): string {
  return `You are the diagnostic engine behind "RepairBeforeReplace", an app that looks at a photo of a broken physical object and tells the user whether it's worth repairing before replacing it.

Look closely at the attached photo and produce a single JSON object (and nothing else — no markdown fences, no commentary) describing a plausible diagnosis, with exactly this shape:

{
  "name": string (short product name, e.g. "Front-Loading Washing Machine"),
  "category": one of ${JSON.stringify(CATEGORIES)},
  "modelNumber": string (a plausible model/spec string),
  "symptoms": string[] (2-4 visible/likely symptoms),
  "primaryIssue": {
    "name": string (short failure mode name),
    "confidence": number (55-99),
    "description": string (1-3 sentences explaining what's likely wrong),
    "rootCause": string (short likely root cause)
  },
  "secondaryPossibilities": [ { "name": string, "confidence": number (10-70), "description": string, "estimatedCost": string (INR range like "₹300 – ₹600") } ] (1-3 items),
  "repairability": {
    "partsAvailability": number (0-100),
    "repairComplexity": number (0-100, higher = easier),
    "costRatio": number (0-100, higher = better savings ratio),
    "productAccessibility": number (0-100)
  },
  "markers": [ { "id": string (slug), "label": string (UPPERCASE short label), "category": "issue"|"component"|"sensor"|"normal", "x": number (0-100, % from left), "y": number (0-100, % from top), "width": number (5-40), "height": number (5-40), "title": string, "description": string, "status": "critical"|"warning"|"nominal" } ] (1-4 items, positioned over the actual visible components in the photo),
  "repairCostRange": string (INR range, e.g. "₹800 – ₹1,500"),
  "replaceCost": string (INR value, e.g. "₹18,000"),
  "estimatedTime": string (e.g. "30 – 60 min"),
  "difficulty": one of "Easy","Moderate","Advanced","Professional Recommended",
  "toolsRequired": [ { "name": string, "spec": string } ] (2-5 items),
  "safetyWarnings": string[] (1-4 items),
  "repairSteps": [ { "stepNumber": number, "title": string, "subtitle": string, "description": string, "details": string[] (2-3 items), "safetyNote": string (optional), "proTip": string (optional) } ] (3-5 steps),
  "impact": { "materialSavedKg": number, "co2SavedKg": number, "eWasteDivertedPercent": number }
}

Ground every field in what is actually visible in the photo where possible (object type, apparent damage, wear, context clues). Be specific and realistic, not generic. Costs should be realistic in Indian Rupees for this kind of object and repair.
${categoryHint ? `The user hinted this object belongs to the category: ${categoryHint}.` : ''}
${notes ? `The user described the problem as: "${notes}"` : ''}

Respond with ONLY the JSON object, no other text.`;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '<unreadable body>';
  }
}

function extractJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

function asNumber(v: unknown, fallback: number, min = 0, max = 100): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function fallbackProfileFor(category: DiagnosticCategory) {
  return FAILURE_PROFILES.find((p) => p.category === category) ?? FAILURE_PROFILES[0];
}

function verdictForScore(score: number): string {
  if (score >= 90) return 'Ideal candidate for DIY repair';
  if (score >= 80) return 'Excellent candidate for repair';
  if (score >= 65) return 'Good candidate for repair';
  if (score >= 45) return 'Fair candidate — weigh cost carefully';
  return 'Repair may not be cost-effective — consider professional evaluation';
}

/**
 * Coerces (and where necessary, backfills) a raw parsed AI response into a complete,
 * internally-consistent GeneratedDiagnosis. Scores/verdict/savings are always
 * recomputed server-side from the underlying numbers rather than trusted verbatim from
 * the model, so the displayed math always adds up.
 */
function normalizeAiResult(raw: Record<string, unknown>): GeneratedDiagnosis {
  const categoryRaw = asString(raw.category, 'Electronics');
  const category = (CATEGORIES.find((c) => c.toLowerCase() === categoryRaw.toLowerCase()) ??
    'Electronics') as DiagnosticCategory;
  const fallback = fallbackProfileFor(category);

  const repairabilityRaw = (raw.repairability as Record<string, unknown>) ?? {};
  const factors = {
    partsAvailability: asNumber(repairabilityRaw.partsAvailability, fallback.repairabilityBase.partsAvailability),
    repairComplexity: asNumber(repairabilityRaw.repairComplexity, fallback.repairabilityBase.repairComplexity),
    costRatio: asNumber(repairabilityRaw.costRatio, fallback.repairabilityBase.costRatio),
    productAccessibility: asNumber(
      repairabilityRaw.productAccessibility,
      fallback.repairabilityBase.productAccessibility
    ),
  };
  const totalScore = Math.round(
    (factors.partsAvailability + factors.repairComplexity + factors.costRatio + factors.productAccessibility) / 4
  );

  const primaryIssueRaw = (raw.primaryIssue as Record<string, unknown>) ?? {};
  const primaryIssue = {
    name: asString(primaryIssueRaw.name, fallback.primaryIssue.name),
    confidence: asNumber(primaryIssueRaw.confidence, fallback.primaryIssue.confidence, 40, 99),
    description: asString(primaryIssueRaw.description, fallback.primaryIssue.description),
    rootCause: asString(primaryIssueRaw.rootCause, fallback.primaryIssue.rootCause),
  };

  const secondaryRaw = Array.isArray(raw.secondaryPossibilities) ? raw.secondaryPossibilities : [];
  const secondaryPossibilities: SecondaryPossibility[] =
    secondaryRaw.length > 0
      ? secondaryRaw.slice(0, 4).map((s, i) => {
          const item = (s as Record<string, unknown>) ?? {};
          return {
            name: asString(item.name, `Alternate Possibility ${i + 1}`),
            confidence: asNumber(item.confidence, 30, 5, 90),
            description: asString(item.description, 'Additional inspection recommended to confirm.'),
            estimatedCost: asString(item.estimatedCost, '₹200 – ₹500'),
          };
        })
      : fallback.secondaryPossibilities;

  const markersRaw = Array.isArray(raw.markers) ? raw.markers : [];
  const markers: ComponentMarker[] =
    markersRaw.length > 0
      ? markersRaw.slice(0, 6).map((m, i) => {
          const item = (m as Record<string, unknown>) ?? {};
          const statusRaw = asString(item.status, 'warning').toLowerCase();
          const status: ComponentMarker['status'] =
            statusRaw === 'critical' || statusRaw === 'nominal' ? (statusRaw as ComponentMarker['status']) : 'warning';
          const categoryRawM = asString(item.category, 'component').toLowerCase();
          const markerCategory: ComponentMarker['category'] = (
            ['issue', 'component', 'sensor', 'normal'].includes(categoryRawM) ? categoryRawM : 'component'
          ) as ComponentMarker['category'];
          return {
            id: asString(item.id, `marker-${i + 1}`),
            label: asString(item.label, `COMPONENT ${i + 1}`).toUpperCase(),
            category: markerCategory,
            x: asNumber(item.x, 40 + i * 10, 5, 95),
            y: asNumber(item.y, 40 + i * 10, 5, 95),
            width: asNumber(item.width, 20, 5, 60),
            height: asNumber(item.height, 20, 5, 60),
            title: asString(item.title, asString(item.label, `Component ${i + 1}`)),
            description: asString(item.description, 'Flagged for closer inspection.'),
            status,
            symptomDetected: typeof item.symptomDetected === 'string' ? item.symptomDetected : undefined,
          };
        })
      : fallback.markers;

  const toolsRaw = Array.isArray(raw.toolsRequired) ? raw.toolsRequired : [];
  const toolsRequired =
    toolsRaw.length > 0
      ? toolsRaw.slice(0, 8).map((t, i) => {
          const item = (t as Record<string, unknown>) ?? {};
          const spec = typeof item.spec === 'string' && item.spec.trim() ? item.spec.trim() : undefined;
          return { name: asString(item.name, `Tool ${i + 1}`), spec };
        })
      : fallback.toolsRequired;

  const safetyRaw = Array.isArray(raw.safetyWarnings) ? raw.safetyWarnings : [];
  const safetyWarnings =
    safetyRaw.filter((w) => typeof w === 'string' && w.trim()).length > 0
      ? (safetyRaw.filter((w) => typeof w === 'string' && w.trim()) as string[])
      : fallback.safetyWarnings;

  const stepsRaw = Array.isArray(raw.repairSteps) ? raw.repairSteps : [];
  const repairSteps: RepairStep[] =
    stepsRaw.length > 0
      ? stepsRaw.slice(0, 8).map((s, i) => {
          const item = (s as Record<string, unknown>) ?? {};
          const details = Array.isArray(item.details)
            ? (item.details.filter((d) => typeof d === 'string') as string[])
            : ['Follow standard procedure for this component.'];
          return {
            stepNumber: asNumber(item.stepNumber, i + 1, 1, 20),
            title: asString(item.title, `Step ${i + 1}`),
            subtitle: asString(item.subtitle, ''),
            description: asString(item.description, ''),
            details: details.length > 0 ? details : ['Proceed carefully and verify each connection.'],
            safetyNote: typeof item.safetyNote === 'string' ? item.safetyNote : undefined,
            proTip: typeof item.proTip === 'string' ? item.proTip : undefined,
            imageUrl: fallback.photoUrl,
          };
        })
      : fallback.repairSteps.map((step) => ({ ...step, imageUrl: fallback.photoUrl }));

  const impactRaw = (raw.impact as Record<string, unknown>) ?? {};
  const impact: ImpactMetrics = {
    materialSavedKg: asNumber(impactRaw.materialSavedKg, fallback.impactBase.materialSavedKg, 0, 500),
    co2SavedKg: asNumber(impactRaw.co2SavedKg, fallback.impactBase.co2SavedKg, 0, 2000),
    eWasteDivertedPercent: asNumber(impactRaw.eWasteDivertedPercent, 100, 0, 100),
    waterSavedLiters: typeof impactRaw.waterSavedLiters === 'number' ? impactRaw.waterSavedLiters : undefined,
  };

  const repairCostRange = asString(raw.repairCostRange, fallback.repairCostRange);
  const replaceCost = asString(raw.replaceCost, fallback.replaceCost);
  const repairMid = parseINR(repairCostRange);
  const replaceVal = parseINR(replaceCost);
  const savings = Math.max(replaceVal - repairMid, 0);

  const difficultyRaw = asString(raw.difficulty, fallback.difficulty);
  const difficulty = (['Easy', 'Moderate', 'Advanced', 'Professional Recommended'].includes(difficultyRaw)
    ? difficultyRaw
    : fallback.difficulty) as GeneratedDiagnosis['difficulty'];

  const symptomsRaw = Array.isArray(raw.symptoms) ? raw.symptoms.filter((s) => typeof s === 'string') : [];

  return {
    name: asString(raw.name, fallback.objectName),
    category,
    modelNumber: asString(raw.modelNumber, fallback.modelNumber),
    symptoms: symptomsRaw.length > 0 ? (symptomsRaw as string[]) : fallback.symptoms,
    repairability: { ...factors, totalScore, verdict: verdictForScore(totalScore) },
    primaryIssue,
    secondaryPossibilities,
    markers,
    repairCostRange,
    replaceCost,
    potentialSavings: `${formatINR(savings)}+`,
    estimatedTime: asString(raw.estimatedTime, fallback.estimatedTime),
    difficulty,
    toolsRequired,
    safetyWarnings,
    repairSteps,
    impact,
    photoUrl: fallback.photoUrl,
  };
}

export async function runAiDiagnosis(input: DiagnoseInput): Promise<GeneratedDiagnosis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !input.imageBytes || input.imageBytes.length === 0) return null;

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const mediaType = input.mimeType && input.mimeType.startsWith('image/') ? input.mimeType : 'image/jpeg';
  const base64 = input.imageBytes.toString('base64');

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2200,
        temperature: 0.4,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: buildPrompt(input.notes, input.categoryHint) },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error('[aiEngine] Anthropic API error', res.status, await safeText(res));
      return null;
    }

    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const textBlock = Array.isArray(data.content) ? data.content.find((b) => b.type === 'text') : undefined;
    if (!textBlock?.text) return null;

    const parsed = extractJson(textBlock.text);
    if (!parsed) return null;

    return normalizeAiResult(parsed);
  } catch (err) {
    console.error('[aiEngine] AI diagnosis failed, falling back to heuristic engine', err);
    return null;
  }
}
