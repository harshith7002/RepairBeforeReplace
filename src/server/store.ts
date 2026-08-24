import fs from 'fs/promises';
import path from 'path';
import { DiagnosticItem } from '../types';
import { MOCK_ITEMS } from '../data/mockData';

/**
 * Lightweight file-backed persistence layer.
 *
 * There is no external database in this project — diagnostic records are stored as a
 * single JSON document on disk (data/diagnostics.json). That's a deliberate choice: it
 * keeps the project runnable with zero extra setup (no DB server, no native bindings to
 * compile on Windows) while still giving every API route real, durable, shared state
 * across requests and server restarts. Writes are serialized through an in-process lock
 * so concurrent requests can't corrupt the file.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'diagnostics.json');

function seedItems(): DiagnosticItem[] {
  const now = Date.now();
  return MOCK_ITEMS.map((item, idx) => ({
    ...item,
    sourceType: 'seed' as const,
    // Stagger seed timestamps so newest-first sorting matches the original demo order.
    createdAt: new Date(now - (MOCK_ITEMS.length - idx) * 60 * 60 * 1000).toISOString(),
    completedSteps: [],
  }));
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(seedItems(), null, 2), 'utf-8');
  }
}

async function readAllRaw(): Promise<DiagnosticItem[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt or unreadable file — fail safe to an empty store rather than crashing routes.
    return [];
  }
}

async function writeAllRaw(items: DiagnosticItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmpFile = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(items, null, 2), 'utf-8');
  await fs.rename(tmpFile, DATA_FILE);
}

// Simple async mutex: chain every write behind the previous one.
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
  return readAllRaw();
}

export async function list(filter: ListFilter = {}): Promise<DiagnosticItem[]> {
  let items = await readAllRaw();

  items = items.slice().sort((a, b) => {
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
  const items = await readAllRaw();
  return items.find((i) => i.id === id);
}

export async function insert(item: DiagnosticItem): Promise<DiagnosticItem> {
  return withLock(async () => {
    const items = await readAllRaw();
    items.push(item);
    await writeAllRaw(items);
    return item;
  });
}

export async function update(
  id: string,
  patch: Partial<DiagnosticItem>
): Promise<DiagnosticItem | undefined> {
  return withLock(async () => {
    const items = await readAllRaw();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch };
    await writeAllRaw(items);
    return items[idx];
  });
}

export async function remove(id: string): Promise<boolean> {
  return withLock(async () => {
    const items = await readAllRaw();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    await writeAllRaw(items);
    return true;
  });
}
