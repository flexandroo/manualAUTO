// Maps a sticker (article + productCode) to its category. Categories
// drive the sidebar grouping in the stickers tab; rows that match no
// rule fall back to "Інше".
//
// Order matters: more specific rules first. A row is assigned to the
// first matching category.

const CATEGORY_OTHER = 'Інше';
export { CATEGORY_OTHER };

const ORDER = [
  'Колектори з кранами',
  'Колектори з витратомірами',
  'Колектори з гідрострілкою',
  'Колектори однобалкові (Mini)',
  'Колектори 150 мм',
  'Колектори 200 мм',
  'Колектори 240 мм',
  'Колектори 300 мм',
  'Гідрострілки',
  'Насосні групи',
  'Сепаратори',
  'Колекторні шафи',
  'Термостатичні крани',
  'Змішувальні крани',
  'Електроприводи',
  'Каналізаційні установки',
  'Насоси циркуляційні',
  'Теплові насоси',
  'Буферні ємності',
  'Фанкойли',
  'Комплекти кранів',
  CATEGORY_OTHER,
] as const;

export function getStickerCategory(input: { articleCode?: string; productCode?: string }): string {
  const art = (input.articleCode || '').trim().toUpperCase();
  const code = (input.productCode || '').trim().toUpperCase();
  const hay = art + ' ' + code;

  // TJ floor heating manifolds — split by flowmeter presence
  if (/TJ-R-W-/.test(hay)) return 'Колектори з кранами';
  if (/TJ-W-/.test(hay)) return 'Колектори з витратомірами';
  // TJ accessories (bypass, eurokonus, mixing unit) → Інше
  if (/TJ-(B-|EC-|MU-)/.test(hay)) return CATEGORY_OTHER;

  // Hydraulic separators (ГС-25..30): productCode ГС- or article 8404002x/3x
  if (/^ГС-/.test(code) || /^8404002\d/.test(art) || /^8404003\d/.test(art))
    return 'Гідрострілки';

  // Pump groups — НГ-… (any variant)
  if (/^НГ-/.test(code)) return 'Насосні групи';
  if (
    /^(84030|84130|84142|84300|84310|84312|84320|84324|84600|84610|84612|84620|84622)/.test(
      art
    )
  )
    return 'Насосні групи';

  // Cabinets
  if (/^TJ00/.test(art)) return 'Колекторні шафи';

  // Valves & drives
  if (/^TMV/.test(art)) return 'Термостатичні крани';
  if (/^RMV/.test(art)) return 'Змішувальні крани';
  if (/^AQUA/.test(art)) return 'Електроприводи';
  if (/^WT/.test(art)) return 'Каналізаційні установки';

  // Pumps
  if (/^(30|33|38)/.test(art)) return 'Насоси циркуляційні';

  // Heat pumps / buffers / fancoils (residential)
  if (/^(51040|51060|51070|51160|53060)/.test(art)) return 'Теплові насоси';
  if (/^(52083|52084|52086|52060)/.test(art)) return 'Буферні ємності';
  if (/^54/.test(art)) return 'Фанкойли';

  // K-collectors — order matters: КГС before plain К, Mini before pitch buckets
  if (/^КГС/.test(code)) return 'Колектори з гідрострілкою';

  // Mini single-beam: explicit Mini hint in code or article ending in 91
  if (
    /\.100$/.test(code) ||
    /\(80\)|\(100\)|\(114\)/.test(code) ||
    /^8404[0-9]{3}91/.test(art)
  )
    return 'Колектори однобалкові (Mini)';

  // Standard K-collectors split by the pitch value in parens
  const pitchMatch = code.match(/\((\d+)\)/);
  if (pitchMatch && /^К/.test(code)) {
    const pitch = parseInt(pitchMatch[1], 10);
    if (pitch === 150) return 'Колектори 150 мм';
    if (pitch === 200) return 'Колектори 200 мм';
    if (pitch === 240) return 'Колектори 240 мм';
    if (pitch === 300) return 'Колектори 300 мм';
  }

  // Air / dirt separators (4xxxx range)
  if (/^(41015|41020|41025|42020|42025|42032|42040|43020|43025|43050|44032|47025|47032)/.test(art))
    return 'Сепаратори';

  // Valve kits
  if (/^200/.test(art)) return 'Комплекти кранів';

  return CATEGORY_OTHER;
}

/** Lists every known category name in display order. */
export function listCategories(): string[] {
  return [...ORDER];
}
