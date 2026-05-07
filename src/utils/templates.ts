import type { InstructionData, Page } from '../types/instruction';
import { newId } from './id';

// User-defined product templates: snapshots of an entire InstructionData
// that the user has saved as a starting point for new documents. Stored
// in localStorage under a dedicated key so they survive document edits.
//
// Templates intentionally store the full document tree (including
// element IDs); we re-stamp every id when applying so the loaded copy
// doesn't collide with the current document or with itself if applied
// twice.

const TEMPLATES_KEY = 'manualAUTO:templates:v1';

export interface Template {
  id: string;
  name: string;
  createdAt: number;
  data: InstructionData;
}

export function listTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Template =>
        t && typeof t.id === 'string' && typeof t.name === 'string' && t.data
    );
  } catch {
    return [];
  }
}

function persist(templates: Template[]) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch {
    /* quota — silently drop; user will be told via UI on next save */
  }
}

export function saveTemplate(name: string, data: InstructionData): Template {
  const next: Template = {
    id: newId('tmpl'),
    name: name.trim() || 'Шаблон без назви',
    createdAt: Date.now(),
    data: deepClone(data),
  };
  const all = listTemplates();
  all.push(next);
  persist(all);
  return next;
}

export function deleteTemplate(id: string) {
  const all = listTemplates().filter((t) => t.id !== id);
  persist(all);
}

export function renameTemplate(id: string, name: string) {
  const all = listTemplates().map((t) =>
    t.id === id ? { ...t, name: name.trim() || t.name } : t
  );
  persist(all);
}

// Returns a fresh InstructionData with all internal ids regenerated, so
// pages/elements from the template don't collide if applied multiple
// times or merged into an existing document.
export function instantiateTemplate(template: Template): InstructionData {
  const cloned = deepClone(template.data);
  cloned.pages = cloned.pages.map(reIdPage);
  return cloned;
}

function reIdPage(page: Page): Page {
  const next = { ...page, id: newId('p') };
  if (next.type === 'standard' && Array.isArray(next.elements)) {
    next.elements = next.elements.map(reIdElement);
  }
  if (next.type === 'cover' && Array.isArray(next.elements)) {
    next.elements = next.elements.map(reIdElement);
  }
  return next;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reIdElement(el: any): any {
  if (!el || typeof el !== 'object') return el;
  const next = { ...el, id: newId('el') };
  if (el.type === 'twoColumn') {
    next.left = Array.isArray(el.left) ? el.left.map(reIdElement) : [];
    next.right = Array.isArray(el.right) ? el.right.map(reIdElement) : [];
  }
  return next;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
