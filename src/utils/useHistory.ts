import { useCallback, useEffect, useRef, useState } from 'react';

// Lightweight undo/redo wrapper around a single piece of state.
// Keeps a bounded ring buffer of past values so a long editing session
// doesn't grow memory unbounded. Designed for React state where each
// value is a serialisable snapshot of the document.

const MAX_HISTORY = 50;
// Coalesce edits that arrive within this window into a single history
// entry, so typing each character doesn't create 100 undo steps.
const COALESCE_MS = 600;

interface HistoryAPI<T> {
  state: T;
  set: (next: T | ((prev: T) => T), opts?: { coalesce?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory<T>(initial: T): HistoryAPI<T> {
  const [state, setStateRaw] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const lastChangeAt = useRef<number>(0);
  const [, forceRender] = useState(0);

  const set = useCallback(
    (next: T | ((prev: T) => T), opts?: { coalesce?: boolean }) => {
      setStateRaw((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        if (resolved === prev) return prev;
        const now = Date.now();
        const shouldCoalesce =
          opts?.coalesce !== false && now - lastChangeAt.current < COALESCE_MS;
        if (!shouldCoalesce) {
          past.current.push(prev);
          if (past.current.length > MAX_HISTORY) past.current.shift();
        }
        future.current = [];
        lastChangeAt.current = now;
        return resolved;
      });
      forceRender((n) => n + 1);
    },
    []
  );

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    setStateRaw((curr) => {
      const prev = past.current.pop() as T;
      future.current.push(curr);
      lastChangeAt.current = 0; // break coalesce after undo
      return prev;
    });
    forceRender((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    setStateRaw((curr) => {
      const next = future.current.pop() as T;
      past.current.push(curr);
      lastChangeAt.current = 0;
      return next;
    });
    forceRender((n) => n + 1);
  }, []);

  // Global Ctrl+Z / Ctrl+Shift+Z (Cmd on Mac). Skip when the user is
  // typing in an input/textarea/contenteditable so the browser's own
  // undo handles those.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === 'z' && e.shiftKey) || k === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
