import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getById, remove, update } from '@/server/store';

export const runtime = 'nodejs';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const item = await getById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Diagnostic record not found.' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const patch: { completedSteps?: number[] } = {};
  const completedSteps = (body as Record<string, unknown>).completedSteps;
  if (Array.isArray(completedSteps) && completedSteps.every((n) => typeof n === 'number')) {
    patch.completedSteps = completedSteps;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: 'No recognized fields to update. Expected { completedSteps: number[] }.' },
      { status: 400 }
    );
  }

  const updated = await update(params.id, patch);
  if (!updated) {
    return NextResponse.json({ error: 'Diagnostic record not found.' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const item = await getById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Diagnostic record not found.' }, { status: 404 });
  }

  const ok = await remove(params.id);

  // Best-effort cleanup of an uploaded image file. Seed items point at external
  // (Unsplash/Picsum) URLs, so only locally-stored uploads are ever removed here.
  if (ok && item.fullImageUrl?.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', item.fullImageUrl);
    fs.unlink(filePath).catch(() => {
      /* non-fatal: file may already be gone */
    });
  }

  return NextResponse.json({ ok });
}
