import { NextResponse } from 'next/server';
import { readAll } from '@/server/store';
import { parseINR } from '@/server/parseCurrency';

export const runtime = 'nodejs';

export async function GET() {
  const items = await readAll();

  let totalSavingsINR = 0;
  let totalCO2SavedKg = 0;
  let totalMaterialSavedKg = 0;
  const categoryCounts: Record<string, number> = {};

  for (const item of items) {
    totalSavingsINR += parseINR(item.potentialSavings);
    totalCO2SavedKg += item.impact?.co2SavedKg ?? 0;
    totalMaterialSavedKg += item.impact?.materialSavedKg ?? 0;
    categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
  }

  return NextResponse.json({
    totalDiagnoses: items.length,
    totalSavingsINR: Math.round(totalSavingsINR),
    totalCO2SavedKg: Math.round(totalCO2SavedKg * 10) / 10,
    totalMaterialSavedKg: Math.round(totalMaterialSavedKg * 10) / 10,
    categoryCounts,
  });
}
