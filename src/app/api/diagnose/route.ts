import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { runDiagnosis } from '@/server/diagnose';
import { insert } from '@/server/store';
import { DiagnosticItem } from '@/types';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

function extensionFor(mimeType: string, fallbackName: string): string {
  if (EXTENSION_BY_MIME[mimeType]) return EXTENSION_BY_MIME[mimeType];
  const ext = path.extname(fallbackName).replace('.', '').toLowerCase();
  return ext || 'jpg';
}

// Duck-typed File check: safer than `instanceof File` since the exact global File
// implementation can vary slightly across Node runtimes that Next.js supports.
function isFileLike(value: FormDataEntryValue | null): value is File {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as File).arrayBuffer === 'function' &&
    typeof (value as File).type === 'string' &&
    typeof (value as File).size === 'number'
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const categoryHint = formData.get('category');
    const notes = formData.get('notes');

    if (!isFileLike(file)) {
      return NextResponse.json(
        { error: 'An image file is required (form field name "image").' },
        { status: 400 }
      );
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file must be an image.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'Image is too large (10MB max).' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded image is empty.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const id = randomUUID();
    let imageUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    try {
      const ext = extensionFor(file.type, file.name || '');
      const savedFileName = `${id}.${ext}`;
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, savedFileName), buffer);
      imageUrl = `/uploads/${savedFileName}`;
    } catch {
      // Read-only serverless filesystem on Netlify/Vercel — imageUrl stays base64 Data URI
    }

    const categoryHintStr = typeof categoryHint === 'string' && categoryHint ? categoryHint : undefined;
    const notesStr = typeof notes === 'string' && notes ? notes : undefined;

    const { diagnosis, source } = await runDiagnosis({
      imageBytes: buffer,
      mimeType: file.type,
      filename: file.name || undefined,
      categoryHint: categoryHintStr,
      notes: notesStr,
    });

    const now = new Date();
    const item: DiagnosticItem = {
      id,
      name: diagnosis.name,
      category: diagnosis.category,
      modelNumber: diagnosis.modelNumber,
      thumbnailUrl: imageUrl,
      fullImageUrl: imageUrl,
      symptoms: diagnosis.symptoms,
      repairability: diagnosis.repairability,
      primaryIssue: diagnosis.primaryIssue,
      secondaryPossibilities: diagnosis.secondaryPossibilities,
      markers: diagnosis.markers,
      repairCostRange: diagnosis.repairCostRange,
      replaceCost: diagnosis.replaceCost,
      potentialSavings: diagnosis.potentialSavings,
      estimatedTime: diagnosis.estimatedTime,
      difficulty: diagnosis.difficulty,
      toolsRequired: diagnosis.toolsRequired,
      safetyWarnings: diagnosis.safetyWarnings,
      repairSteps: diagnosis.repairSteps,
      impact: diagnosis.impact,
      diagnosedDate: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      sourceType: source,
      createdAt: now.toISOString(),
      completedSteps: [],
      userNotes: notesStr,
    };

    await insert(item);

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error('[api/diagnose] failed', err);
    return NextResponse.json(
      { error: 'Diagnosis failed unexpectedly. Please try again.' },
      { status: 500 }
    );
  }
}
