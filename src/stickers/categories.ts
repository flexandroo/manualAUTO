// Maps a product article code to its category. Categories drive the
// sidebar grouping in the stickers tab; new products fall back to
// "Інше" when no rule matches.
//
// Rules are ordered by specificity — longer / more specific prefixes
// come first so e.g. "84040TJ-" beats the looser "84040".

export interface CategoryRule {
  /** Regex tested against the article code (case-insensitive). */
  match: RegExp;
  /** Display name shown in the sidebar. */
  name: string;
}

const RULES: readonly CategoryRule[] = [
  { match: /^84040TJ-/i, name: 'Колектори Termojet (нова лінія)' },
  { match: /^84040/, name: 'Колектори' },
  { match: /^(84030|84130|84300|84324|84600|84610|84620|84142)/, name: 'Насосні групи' },
  { match: /^(42040|43050)/, name: 'Сепаратори' },
  { match: /^(51040|51060|53060)/, name: 'Теплові насоси' },
  { match: /^(52084|52086)/, name: 'Буферні ємності' },
  { match: /^(54010|54040)/, name: 'Фанкойли' },
  { match: /^TJ00/i, name: 'Колекторні шафи' },
  { match: /^TMV/i, name: 'Термостатичні крани' },
  { match: /^RMV/i, name: 'Змішувальні крани' },
  { match: /^AQUA/i, name: 'Електроприводи' },
  { match: /^WT/i, name: 'Каналізаційні установки' },
  { match: /^(30|33|38)/, name: 'Насоси циркуляційні' },
  { match: /^200/, name: 'Комплекти кранів' },
];

export const CATEGORY_OTHER = 'Інше';

export function getStickerCategory(article: string): string {
  const trimmed = (article || '').trim();
  for (const rule of RULES) {
    if (rule.match.test(trimmed)) return rule.name;
  }
  return CATEGORY_OTHER;
}

/** Lists every known category name in display order, plus "Інше" last.
 *  Used to render the sidebar groups in a consistent order. */
export function listCategories(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of RULES) {
    if (!seen.has(r.name)) {
      seen.add(r.name);
      out.push(r.name);
    }
  }
  out.push(CATEGORY_OTHER);
  return out;
}
