import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

describe('useHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial state and disables undo/redo', () => {
    const { result } = renderHook(() => useHistory(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('records history and lets undo restore previous values', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1, { coalesce: false });
    });
    act(() => {
      result.current.set(2, { coalesce: false });
    });
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    act(() => result.current.undo());
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
  });

  it('redo replays a value popped by undo', () => {
    const { result } = renderHook(() => useHistory('a'));
    act(() => result.current.set('b', { coalesce: false }));
    act(() => result.current.undo());
    expect(result.current.state).toBe('a');
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.redo());
    expect(result.current.state).toBe('b');
  });

  it('coalesces edits within 600ms into a single history step', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));
    // All three landed within the coalesce window — undo should jump
    // straight back to the original 0, not step through 1,2,3.
    act(() => result.current.undo());
    expect(result.current.state).toBe(0);
  });

  it('breaks coalescing when set is called past the window', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.set(1));
    act(() => {
      vi.advanceTimersByTime(800);
    });
    act(() => result.current.set(2));
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
  });

  it('reset clears history and replaces state', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.set(1, { coalesce: false }));
    act(() => result.current.set(2, { coalesce: false }));
    act(() => result.current.reset(99));
    expect(result.current.state).toBe(99);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('a fresh edit clears the redo stack', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.set(1, { coalesce: false }));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.set(2, { coalesce: false }));
    expect(result.current.canRedo).toBe(false);
  });
});
