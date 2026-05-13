import type { InstructionData } from '../types/instruction';
import type { StickerData } from '../stickers/types';

// IndexedDB-backed storage for documents and templates.
//
// Why IndexedDB instead of localStorage: image data URLs in
// InstructionData routinely push the document past a few MB; the
// ~5 MB localStorage origin quota fills up after just a handful of
// uploads. IndexedDB has multi-hundred-MB quotas without a prompt and
// stores objects directly so we don't pay JSON.stringify on every save.
//
// One database, three stores:
//   - documents : keyed by docId, each row holds a doc + metadata
//   - templates : keyed by templateId, each row holds a template
//   - meta      : single-row settings ('activeDocId', etc.)
//
// All public functions return promises and never throw — failures
// resolve to a sensible empty value so the editor stays usable even
// if IndexedDB is unavailable (e.g. private browsing on some
// browsers). The caller falls back to in-memory state.

const DB_NAME = 'manualAUTO';
const DB_VERSION = 2;
const STORE_DOCS = 'documents';
const STORE_TEMPLATES = 'templates';
const STORE_META = 'meta';
const STORE_STICKERS = 'stickers';

export interface DocumentRow {
  id: string;
  name: string;
  data: InstructionData;
  updatedAt: number;
  createdAt: number;
}

export interface TemplateRow {
  id: string;
  name: string;
  data: InstructionData;
  createdAt: number;
}

export interface StickerRow {
  id: string;
  data: StickerData;
  updatedAt: number;
  createdAt: number;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DOCS)) {
        db.createObjectStore(STORE_DOCS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_TEMPLATES)) {
        db.createObjectStore(STORE_TEMPLATES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_STICKERS)) {
        db.createObjectStore(STORE_STICKERS, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T | null> {
  return openDb().then((db) => {
    if (!db) return null;
    return new Promise<T | null>((resolve) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      const req = fn(s);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  });
}

// ─── documents ────────────────────────────────────────────────────────────

export async function listDocuments(): Promise<DocumentRow[]> {
  const all = (await tx<DocumentRow[]>(STORE_DOCS, 'readonly', (s) => s.getAll())) ?? [];
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getDocument(id: string): Promise<DocumentRow | null> {
  const row = await tx<DocumentRow>(STORE_DOCS, 'readonly', (s) => s.get(id));
  return row ?? null;
}

export async function putDocument(row: DocumentRow): Promise<void> {
  await tx(STORE_DOCS, 'readwrite', (s) => s.put(row));
}

export async function deleteDocument(id: string): Promise<void> {
  await tx(STORE_DOCS, 'readwrite', (s) => s.delete(id));
}

// ─── templates ────────────────────────────────────────────────────────────

export async function listTemplateRows(): Promise<TemplateRow[]> {
  const all = (await tx<TemplateRow[]>(STORE_TEMPLATES, 'readonly', (s) => s.getAll())) ?? [];
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function putTemplateRow(row: TemplateRow): Promise<void> {
  await tx(STORE_TEMPLATES, 'readwrite', (s) => s.put(row));
}

export async function deleteTemplateRow(id: string): Promise<void> {
  await tx(STORE_TEMPLATES, 'readwrite', (s) => s.delete(id));
}

// ─── stickers ─────────────────────────────────────────────────────────────

export async function listStickers(): Promise<StickerRow[]> {
  const all = (await tx<StickerRow[]>(STORE_STICKERS, 'readonly', (s) => s.getAll())) ?? [];
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function putSticker(row: StickerRow): Promise<void> {
  await tx(STORE_STICKERS, 'readwrite', (s) => s.put(row));
}

export async function putStickers(rows: StickerRow[]): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const t = db.transaction(STORE_STICKERS, 'readwrite');
    const store = t.objectStore(STORE_STICKERS);
    for (const row of rows) store.put(row);
    t.oncomplete = () => resolve();
    t.onerror = () => resolve();
    t.onabort = () => resolve();
  });
}

export async function deleteSticker(id: string): Promise<void> {
  await tx(STORE_STICKERS, 'readwrite', (s) => s.delete(id));
}

export async function clearStickers(): Promise<void> {
  await tx(STORE_STICKERS, 'readwrite', (s) => s.clear());
}

// ─── meta ─────────────────────────────────────────────────────────────────

export async function getMeta<T = unknown>(key: string): Promise<T | null> {
  const row = await tx<{ key: string; value: T }>(STORE_META, 'readonly', (s) => s.get(key));
  return row?.value ?? null;
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  await tx(STORE_META, 'readwrite', (s) => s.put({ key, value }));
}
