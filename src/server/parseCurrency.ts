/**
 * Parses INR-formatted display strings used throughout the app (e.g. "₹800 – ₹1,500",
 * "₹18,000+", "₹0 (manual flex)") into a single representative numeric value.
 * Ranges are averaged; trailing "+" or parenthetical notes are ignored.
 */
export function parseINR(input: string | undefined | null): number {
  if (!input) return 0;

  // Strip currency symbol, thousands separators, plus signs, and parenthetical notes.
  const withoutNotes = input.replace(/\([^)]*\)/g, '');
  const cleaned = withoutNotes.replace(/[₹,+\s]/g, '');

  if (!cleaned) return 0;

  const parts = cleaned.split(/[–-]/).map((p) => p.trim()).filter(Boolean);
  const nums = parts.map((p) => parseFloat(p)).filter((n) => Number.isFinite(n));

  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}

export function formatINR(value: number): string {
  const rounded = Math.round(value);
  return `₹${rounded.toLocaleString('en-IN')}`;
}
