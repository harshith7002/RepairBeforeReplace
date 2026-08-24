import { DiagnoseInput, GeneratedDiagnosis, runHeuristicDiagnosis } from './heuristicEngine';
import { isAiEngineAvailable, runAiDiagnosis } from './aiEngine';
import { DiagnosisSource } from '../types';

export interface DiagnosisResult {
  diagnosis: GeneratedDiagnosis;
  source: DiagnosisSource;
}

/**
 * Single entry point the API routes call to actually diagnose an uploaded photo.
 * Tries the real AI vision engine first (only attempted when ANTHROPIC_API_KEY is
 * configured); on any failure, or when no key is set, falls back to the deterministic
 * heuristic knowledge-base engine so the endpoint always returns a usable diagnosis.
 */
export async function runDiagnosis(input: DiagnoseInput): Promise<DiagnosisResult> {
  if (isAiEngineAvailable()) {
    const aiResult = await runAiDiagnosis(input);
    if (aiResult) {
      return { diagnosis: aiResult, source: 'ai' };
    }
  }

  const heuristicResult: GeneratedDiagnosis = runHeuristicDiagnosis(input);
  return { diagnosis: heuristicResult, source: 'heuristic' };
}
