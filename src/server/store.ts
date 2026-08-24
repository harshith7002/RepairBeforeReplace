import fs from 'fs/promises';
import path from 'path';
import { DiagnosticItem } from '../types';
import { MOCK_ITEMS } from '../data/mockData';

/**
 * Safe, hybrid persistence layer.
 * Works seamlessly in-memory on read-only serverless platforms (Netlify, Vercel)
 * and syncs to disk when local filesystem writing is supported.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'diagnostics.json');

function seedItems(): DiagnosticItem[] {
  const now = Date.now();
  return MOCK_ITEMS.map((item, idx) => ({
    ...item,
    sourceType: 'seed' as const,
    createdAt: new Date(now - (MOCK_ITEMS.length - idx) * 60 * 60 * 1000).toISOString(),
    completedSteps: [],
  }));
}

// Global in-memory cache initialized with seed items
let memoryStore: DiagnosticItem[] = seedItems();
let isInitialized = false;

async function ensureMemoryInitialized(): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryStore = parsed;
    }
  } catch {
    // Disk read failed or read-only filesystem (Netlify/Vercel) — memoryStore is already seeded
  }
}

async function safeWriteDisk(items: DiagnosticItem[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(items, null, 2), 'utf-8');
    await fs.rename(tmpFile, DATA_FILE);
  } catch {
    // Read-only filesystem on Netlify/Vercel — safely ignore disk write error
  }
}

let writeLock: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export interface ListFilter {
  category?: string;
  search?: string;
  limit?: number;
}

export async function readAll(): Promise<DiagnosticItem[]> {
  await ensureMemoryInitialized();
  return [...memoryStore];
}

export async function list(filter: ListFilter = {}): Promise<DiagnosticItem[]> {
  await ensureMemoryInitialized();
  let items = [...memoryStore];

  items.sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });

  if (filter.category && filter.category !== 'All') {
    items = items.filter((i) => i.category === filter.category);
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.primaryIssue.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (filter.limit && filter.limit > 0) {
    items = items.slice(0, filter.limit);
  }

  return items;
}

export async function getById(id: string): Promise<DiagnosticItem | undefined> {
  await ensureMemoryInitialized();
  return memoryStore.find((i) => i.id === id);
}

export async function insert(item: DiagnosticItem): Promise<DiagnosticItem> {
  return withLock(async () => {
    await ensureMemoryInitialized();
    // Add to top of memory store
    memoryStore = [item, ...memoryStore];
    await safeWriteDisk(memoryStore);
    return item;
  });
}

export async function update(
  id: string,
  patch: Partial<DiagnosticItem>
): Promise<DiagnosticItem | undefined> {
  return withLock(async () => {
    await ensureMemoryInitialized();
    const idx = memoryStore.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    memoryStore[idx] = { ...memoryStore[idx], ...patch };
    await safeWriteDisk(memoryStore);
    return memoryStore[idx];
  });
}

export async function remove(id: string): Promise<boolean> {
  return withLock(async () => {
    await ensureMemoryInitialized();
    const idx = memoryStore.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    memoryStore.splice(idx, 1);
    await safeWriteDisk(memoryStore);
    return true;
  });
}
