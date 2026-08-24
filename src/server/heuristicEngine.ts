import crypto from 'crypto';
import { FAILURE_PROFILES, CATEGORIES, FailureProfile } from './knowledgeBase';
import { parseINR, formatINR } from './parseCurrency';
import {
  ComponentMarker,
  DiagnosticCategory,
  ImpactMetrics,
  RepairStep,
  RepairabilityBreakdown,
  SecondaryPossibility,
} from '../types';

/**
 * Deterministic, dependency-free "diagnosis" engine used whenever no AI vision API key
 * is configured (or the AI call fails). It is not a real computer-vision model — it
 * selects a plausible failure profile from the hand-authored knowledge base, first by
 * matching keywords in the filename/user notes, and otherwise via a stable hash of the
 * uploaded image bytes so the *same* photo always produces the *same* diagnosis while
 * different photos land on different profiles. Numeric factors get small deterministic
 * jitter so results feel less templated without being random on every request.
 */

export interface DiagnoseInput {
  imageBytes?: Buffer;
  mimeType?: string;
  filename?: string;
  categoryHint?: string;
  notes?: string;
}

export interface GeneratedDiagnosis {
  name: string;
  category: DiagnosticCategory;
  modelNumber: string;
  symptoms: string[];
  repairability: RepairabilityBreakdown;
  primaryIssue: {
    name: string;
    confidence: number;
    description: string;
    rootCause: string;
  };
  secondaryPossibilities: SecondaryPossibility[];
  markers: ComponentMarker[];
  repairCostRange: string;
  replaceCost: string;
  replaceText?: string;
  replacementDisposalNote?: string;
  potentialSavings: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Professional Recommended';
  toolsRequired: { name: string; spec?: string }[];
  safetyWarnings: string[];
  safetyCautionType?: string;
  safetyCautionDesc?: string;
  repairSteps: RepairStep[];
  impact: ImpactMetrics;
  photoUrl: string;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function hashToInt(input: string): number {
  const digest = crypto.createHash('sha256').update(input).digest();
  return digest.readUInt32BE(0);
}

// Deterministic pseudo-random value in [-spread, spread], derived from (seed, index).
function seededJitter(seed: number, index: number, spread: number): number {
  const x = Math.sin(seed + index * 999.111) * 10000;
  const frac = x - Math.floor(x);
  return Math.round((frac * 2 - 1) * spread);
}

function verdictForScore(score: number): string {
  if (score >= 90) return 'Ideal candidate for DIY repair';
  if (score >= 80) return 'Excellent candidate for repair';
  if (score >= 65) return 'Good candidate for repair';
  if (score >= 45) return 'Fair candidate — weigh cost carefully';
  return 'Repair may not be cost-effective — consider professional evaluation';
}

function pickProfileByKeywords(text: string): FailureProfile | undefined {
  const lower = text.toLowerCase();
  let best: { profile: FailureProfile; score: number } | undefined;
  for (const profile of FAILURE_PROFILES) {
    let score = 0;
    for (const kw of profile.keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { profile, score };
    }
  }
  return best?.profile;
}

function computeSeed(input: DiagnoseInput, hintText: string): number {
  const bytes = input.imageBytes;
  if (bytes && bytes.length > 0) {
    const sample =
      bytes.length > 4096
        ? Buffer.concat([bytes.subarray(0, 2048), bytes.subarray(-2048)])
        : bytes;
    return hashToInt(sample.toString('base64') + ':' + bytes.length);
  }
  return hashToInt(hintText || 'repair-before-replace-default-seed');
}

function buildFromProfile(profile: FailureProfile, seed: number): GeneratedDiagnosis {
  const base = profile.repairabilityBase;
  const factors = {
    partsAvailability: clamp(base.partsAvailability + seededJitter(seed, 1, 5)),
    repairComplexity: clamp(base.repairComplexity + seededJitter(seed, 2, 5)),
    costRatio: clamp(base.costRatio + seededJitter(seed, 3, 4)),
    productAccessibility: clamp(base.productAccessibility + seededJitter(seed, 4, 5)),
  };
  const totalScore = Math.round(
    (factors.partsAvailability + factors.repairComplexity + factors.costRatio + factors.productAccessibility) / 4
  );

  const primaryConfidence = clamp(profile.primaryIssue.confidence + seededJitter(seed, 5, 4), 55, 99);

  const repairMid = parseINR(profile.repairCostRange);
  const replaceVal = parseINR(profile.replaceCost);
  const savings = Math.max(replaceVal - repairMid, 0);

  const repairSteps: RepairStep[] = profile.repairSteps.map((step) => ({
    ...step,
    imageUrl: profile.photoUrl,
  }));

  const markers: ComponentMarker[] = profile.markers.map((m, i) => ({
    ...m,
    x: clamp(m.x + seededJitter(seed, 10 + i, 2), 5, 95),
    y: clamp(m.y + seededJitter(seed, 20 + i, 2), 5, 95),
  }));

  return {
    name: profile.objectName,
    category: profile.category,
    modelNumber: profile.modelNumber,
    symptoms: profile.symptoms,
    repairability: {
      ...factors,
      totalScore,
      verdict: verdictForScore(totalScore),
      partsNote: base.partsNote,
      complexityNote: base.complexityNote,
      costRatioNote: base.costRatioNote,
      accessibilityNote: base.accessibilityNote,
    },
    primaryIssue: {
      ...profile.primaryIssue,
      confidence: primaryConfidence,
    },
    secondaryPossibilities: profile.secondaryPossibilities,
    markers,
    repairCostRange: profile.repairCostRange,
    replaceCost: profile.replaceCost,
    replaceText: profile.replaceText,
    replacementDisposalNote: profile.replacementDisposalNote,
    potentialSavings: `${formatINR(savings)}+`,
    estimatedTime: profile.estimatedTime,
    difficulty: profile.difficulty,
    toolsRequired: profile.toolsRequired,
    safetyWarnings: profile.safetyWarnings,
    safetyCautionType: profile.safetyCautionType,
    safetyCautionDesc: profile.safetyCautionDesc,
    repairSteps,
    impact: profile.impactBase,
    photoUrl: profile.photoUrl,
  };
}

export function runHeuristicDiagnosis(input: DiagnoseInput): GeneratedDiagnosis {
  const hintText = [input.filename, input.notes, input.categoryHint].filter(Boolean).join(' ');
  let profile = pickProfileByKeywords(hintText);
  const seed = computeSeed(input, hintText);

  if (!profile) {
    let pool = FAILURE_PROFILES;
    const categoryHint = input.categoryHint as DiagnosticCategory | undefined;
    if (categoryHint && CATEGORIES.includes(categoryHint)) {
      pool = FAILURE_PROFILES.filter((p) => p.category === categoryHint);
    }
    if (pool.length === 0) pool = FAILURE_PROFILES;
    profile = pool[Math.abs(seed) % pool.length];
  }

  return buildFromProfile(profile, seed);
}
