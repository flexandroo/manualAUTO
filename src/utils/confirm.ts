// Wrapper around window.confirm so tests / future custom modal can swap.
export function confirmAction(message: string): boolean {
  return typeof window !== 'undefined' ? window.confirm(message) : false;
}
