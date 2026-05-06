// Stable enough for in-document block IDs.
export function newId(prefix = 'b'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
