import type { InstructionData } from '../types/instruction';
import { initialData } from '../data/initialData';
import { newId } from './id';
import {
  listDocuments,
  putDocument,
  setMeta,
  getMeta,
  type DocumentRow,
  putTemplateRow,
} from './storage';
import { migrateOldBlocksToPages } from './migration';

// One-shot migration from the old single-document localStorage layout
// to IndexedDB-backed multi-document storage. Runs on app start; safe
// to call multiple times — checks for an already-migrated marker first.

const STORAGE_KEY = 'manualAUTO:document:v2';
const LEGACY_STORAGE_KEY = 'manualAUTO:document:v1';
const TEMPLATES_KEY_LS = 'manualAUTO:templates:v1';
const MIGRATION_FLAG = 'lsToIdb-2026-05';

interface LegacyTemplate {
  id: string;
  name: string;
  createdAt: number;
  data: InstructionData;
}

// Cache the in-flight migration so concurrent callers (e.g. React
// StrictMode firing useEffect twice) share a single result instead of
// each creating their own seed document.
let migrationPromise: Promise<{ active: DocumentRow | null; all: DocumentRow[] }> | null = null;

export function migrateLocalStorageToIdb(): Promise<{
  active: DocumentRow | null;
  all: DocumentRow[];
}> {
  if (!migrationPromise) {
    migrationPromise = doMigration();
  }
  return migrationPromise;
}

async function doMigration(): Promise<{ active: DocumentRow | null; all: DocumentRow[] }> {
  const flag = await getMeta<string>('migration');
  const existing = await listDocuments();

  if (flag === MIGRATION_FLAG && existing.length > 0) {
    const activeId = await getMeta<string>('activeDocId');
    const active = existing.find((d) => d.id === activeId) ?? existing[0];
    return { active, all: existing };
  }

  const docFromLs = readLegacyDoc();

  if (existing.length === 0 && docFromLs) {
    const row: DocumentRow = {
      id: newId('doc'),
      name: docFromLs.productName?.trim() || 'Перший документ',
      data: docFromLs,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await putDocument(row);
    await setMeta('activeDocId', row.id);
    await migrateLegacyTemplates();
    await setMeta('migration', MIGRATION_FLAG);
    return { active: row, all: [row] };
  }

  await migrateLegacyTemplates();
  await setMeta('migration', MIGRATION_FLAG);

  if (existing.length > 0) {
    const activeId = await getMeta<string>('activeDocId');
    const active = existing.find((d) => d.id === activeId) ?? existing[0];
    return { active, all: existing };
  }

  // Fresh install with no legacy data: seed a default doc here (rather
  // than in App.tsx) so the cached promise covers the seeding too —
  // otherwise StrictMode's double effect would race and create two.
  const seed: DocumentRow = {
    id: newId('doc'),
    name: 'Перший документ',
    data: initialData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await putDocument(seed);
  await setMeta('activeDocId', seed.id);
  return { active: seed, all: [seed] };
}

function readLegacyDoc(): InstructionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as InstructionData;
      if (parsed && Array.isArray(parsed.pages)) return parsed;
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const migrated = migrateOldBlocksToPages(legacy);
      if (migrated) return migrated;
    }
  } catch {
    /* corrupt — ignore, user will start fresh */
  }
  return null;
}

async function migrateLegacyTemplates(): Promise<void> {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY_LS);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    for (const t of parsed as LegacyTemplate[]) {
      if (!t || typeof t.id !== 'string' || !t.data) continue;
      await putTemplateRow({
        id: t.id,
        name: t.name,
        data: t.data,
        createdAt: t.createdAt ?? Date.now(),
      });
    }
  } catch {
    /* ignore */
  }
}
