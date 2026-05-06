// Heuristic-based PDF -> Block[] parser tuned for the TERMOJET instruction template.
// Extracts text, then runs detectors for each known block type.
//
// Limitations:
// - Two-column layouts produce interleaved text in pdf.js output. The Safety
//   detector knows about this and reassembles 1.1-1.12 by heading patterns.
// - Tables and figures are not extracted (would require image rendering).
// - The user is expected to review and correct blocks after import.

import { extractStructuredText, type PageData } from './pdfExtract';
import type {
  Block,
  ConstructionLegendData,
  CoverBlock,
  InstallationStepsBlockData,
  SafetyBlockData,
  SafetySubsection,
  TechSpecsBlockData,
  TextBlockData,
  WarrantyBlockData,
} from '../types/instruction';
import { newId } from '../utils/id';
import { SAFETY_BLOCK_TITLE, SAFETY_TEMPLATE } from '../templates/safetyBlock';
import { WARRANTY_BLOCK_TITLE, WARRANTY_TEMPLATE } from '../templates/warrantyBlock';

export interface PdfParseReport {
  pages: number;
  detected: { type: string; label: string; ok: boolean; details?: string }[];
}

export interface PdfParseResult {
  blocks: Block[];
  report: PdfParseReport;
}

export async function parsePdfToBlocks(file: File): Promise<PdfParseResult> {
  const pages = await extractStructuredText(file);
  const blocks: Block[] = [];
  const detected: PdfParseReport['detected'] = [];

  // 1) Cover from page 1
  const cover = parseCover(pages[0]);
  blocks.push(cover);
  detected.push({
    type: 'cover',
    label: 'Титульна',
    ok: !!cover.productName,
    details: cover.productName ? `назва: "${cover.productName}", моделей: ${cover.modelCodes.length}` : 'не вдалось визначити назву',
  });

  // 2) Safety block (1.1-1.12)
  const safety = parseSafety(pages);
  if (safety && safety.subsections.length >= 6) {
    blocks.push(safety);
    detected.push({
      type: 'safety',
      label: 'Основні положення',
      ok: true,
      details: `розпізнано ${safety.subsections.length} підрозділів`,
    });
  } else {
    detected.push({
      type: 'safety',
      label: 'Основні положення',
      ok: false,
      details: 'не знайдено — додано стандартний шаблон',
    });
    blocks.push(makeDefaultSafety());
  }

  // 3) Installation steps (2.1, 2.2, ...)
  const install = parseInstallationSteps(pages);
  if (install && install.steps.length >= 1) {
    blocks.push(install);
    detected.push({
      type: 'installationSteps',
      label: 'Інструкція з монтажу',
      ok: true,
      details: `розпізнано ${install.steps.length} кроків`,
    });
  } else {
    detected.push({
      type: 'installationSteps',
      label: 'Інструкція з монтажу',
      ok: false,
      details: 'не знайдено',
    });
  }

  // 4) TechSpecs (Технічні характеристики)
  const techSpecs = parseTechSpecs(pages);
  if (techSpecs) {
    blocks.push(techSpecs);
    const tableInfo = techSpecs.table.rows.length
      ? `, таблиця ${techSpecs.table.headers.length}×${techSpecs.table.rows.length}`
      : '';
    detected.push({
      type: 'techSpecs',
      label: 'Технічні характеристики',
      ok: true,
      details: `${techSpecs.properties.length} властивостей${tableInfo}`,
    });
  } else {
    detected.push({
      type: 'techSpecs',
      label: 'Технічні характеристики',
      ok: false,
      details: 'не знайдено',
    });
  }

  // 5) Construction legend (Конструкція + 1-N виносок)
  const construction = parseConstructionLegend(pages);
  if (construction && construction.items.length >= 1) {
    blocks.push(construction);
    detected.push({
      type: 'constructionLegend',
      label: 'Конструкція + легенда',
      ok: true,
      details: `${construction.items.length} виносок (зображення треба завантажити вручну)`,
    });
  } else {
    detected.push({
      type: 'constructionLegend',
      label: 'Конструкція + легенда',
      ok: false,
      details: 'не знайдено',
    });
  }

  // 6) Warranty (last 1-2 pages)
  const warranty = parseWarranty(pages);
  if (warranty) {
    blocks.push(warranty);
    detected.push({
      type: 'warranty',
      label: 'Гарантія',
      ok: true,
    });
  } else {
    detected.push({
      type: 'warranty',
      label: 'Гарантія',
      ok: false,
      details: 'не знайдено — додано стандартний шаблон',
    });
    blocks.push(makeDefaultWarranty());
  }

  return {
    blocks,
    report: { pages: pages.length, detected },
  };
}

// ---- Cover ----

function parseCover(page: PageData | undefined): CoverBlock {
  const lines = page?.lines ?? [];

  // Find title: first long line that isn't the model list and isn't the small "обладнання для котельні" tagline
  const tagPattern = /обладнання\s+для\s+котельні/i;
  const certPattern = /ТЕХНІЧНИЙ\s+ПАСПОРТ|CERTIFICATE/i;
  const slogPattern = /Швидко|Надійно|Ефективно/i;
  const urlPattern = /www\.|\.com\.ua|\.ua$/i;

  let title = '';
  for (const l of lines) {
    if (l.length < 8) continue;
    if (tagPattern.test(l)) continue;
    if (certPattern.test(l)) continue;
    if (slogPattern.test(l)) continue;
    if (urlPattern.test(l)) continue;
    if (/^[A-ZА-ЯІЇЄҐ][а-яіїєґA-Za-z]/.test(l) && !l.includes(';')) {
      title = l.trim();
      break;
    }
  }

  // Models: collect lines that contain model-code patterns (DASH followed by digits, letters and dots)
  const modelCodes: string[] = [];
  for (const l of lines) {
    if (urlPattern.test(l)) continue;
    if (tagPattern.test(l)) continue;
    if (/[А-ЯІЇЄҐ]{1,5}\s*[-–]\s*\d{2}/.test(l) || /[KК]ГС\s*\d/.test(l) || /НГ\s*[-–]\s*\d/.test(l)) {
      // Split by ';' if multiple codes are on one line
      l.split(/[;\n]/)
        .map((s) => s.trim().replace(/[.,]+$/, ''))
        .filter((s) => s.length > 0 && /\d/.test(s))
        .forEach((m) => modelCodes.push(m));
    }
  }

  const documentType = lines.find((l) => certPattern.test(l)) ?? 'ТЕХНІЧНИЙ ПАСПОРТ';
  const subtitle =
    lines.find((l) => /Інструкція.*монтаж|Інструкція.*експлуатац/i.test(l)) ??
    'Інструкція з монтажу та експлуатації';
  const tagline = lines.find((l) => slogPattern.test(l)) ?? 'Швидко ● Надійно ● Ефективно';
  const websiteUrl = lines.find((l) => urlPattern.test(l)) ?? 'WWW.TERMOJET.COM.UA';

  return {
    id: newId('cover'),
    type: 'cover',
    brand: 'TERMOJET',
    productName: title || 'Назва продукту',
    subtitle,
    modelCodes,
    documentType,
    bulletPoints: [],
    tagline,
    websiteUrl,
    productImages: [],
  };
}

// ---- Safety (1.1-1.12) ----

function parseSafety(pages: PageData[]): SafetyBlockData | null {
  // Find pages that contain "1.1 " heading and "Основні положення"
  const safetyPages = pages.filter(
    (p) => /Основні\s+положення/i.test(p.text) || /^\s*1\.\s*1\s+/m.test(p.text)
  );
  if (safetyPages.length === 0) return null;

  const allText = safetyPages.map((p) => p.text).join('\n');

  // Match each subsection by its number heading (e.g. "1.1 Загальні...", "1. 1 Загальні..." with space)
  // The pdf.js text often has space inside the number ("1. 1") and headings inline with body across columns.
  // Strategy: find all "1. N" markers, slice text between consecutive markers, derive heading from the next non-empty line, body is remainder.

  const headerRegex = /1\.\s*(\d{1,2})\b/g;
  type Marker = { num: number; index: number };
  const markers: Marker[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(allText)) !== null) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 12) {
      // Avoid spurious matches by requiring uppercase Ukrainian/Latin letter next
      const after = allText.slice(m.index + m[0].length, m.index + m[0].length + 60);
      if (/^[\s]+[А-ЯІЇЄҐA-Z]/.test(after)) {
        markers.push({ num: n, index: m.index });
      }
    }
  }
  // Deduplicate (sometimes "1.1" appears multiple times in TOC + body)
  const firstByNum = new Map<number, Marker>();
  for (const mk of markers) {
    if (!firstByNum.has(mk.num)) firstByNum.set(mk.num, mk);
  }
  const ordered = [...firstByNum.values()].sort((a, b) => a.num - b.num);
  if (ordered.length < 6) return null;

  const subsections: SafetySubsection[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const cur = ordered[i];
    const next = ordered[i + 1];
    const slice = allText.slice(cur.index, next ? next.index : cur.index + 1500);
    const lines = slice.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // First line: "1. N Heading text" — strip the number prefix
    const first = lines[0].replace(/^1\.\s*\d{1,2}\s*/, '').trim();
    let heading = first;
    let bodyStartIdx = 1;
    if (heading.length === 0 && lines[1]) {
      heading = lines[1];
      bodyStartIdx = 2;
    }
    const body = lines.slice(bodyStartIdx).join('\n').trim();

    subsections.push({
      number: `1.${cur.num}`,
      heading: heading || `Підрозділ ${cur.num}`,
      body,
    });
  }

  return {
    id: newId('safety'),
    type: 'safety',
    title: SAFETY_BLOCK_TITLE,
    subsections,
  };
}

function makeDefaultSafety(): SafetyBlockData {
  return {
    id: newId('safety'),
    type: 'safety',
    title: SAFETY_BLOCK_TITLE,
    subsections: SAFETY_TEMPLATE.map((s) => ({ ...s })),
  };
}

// ---- Installation steps (2.1, 2.2, ...) ----

function parseInstallationSteps(pages: PageData[]): InstallationStepsBlockData | null {
  const installPages = pages.filter((p) =>
    /Інструкц[іи]я\s+(?:по|з)\s+монтаж|Монтаж\s+(?:колектора|механічної|насосної|обладнання)|^\s*\d\.\s*Монтаж\b/im.test(
      p.text
    )
  );
  if (installPages.length === 0) return null;

  const allText = installPages.map((p) => p.text).join('\n');

  // Find heading
  const headingMatch = allText.match(/(\d\.\s*Інструкція[^\n]*монтажу[^\n]*|Монтаж\s+[^\n]+)/i);
  const heading = headingMatch?.[1]?.trim().replace(/^\d\.\s*/, '') ?? 'Інструкція по монтажу';

  // Find 2.N markers
  const stepRegex = /(\d)\.\s*(\d{1,2})\b/g;
  type Marker = { major: number; minor: number; index: number };
  const markers: Marker[] = [];
  let m: RegExpExecArray | null;
  while ((m = stepRegex.exec(allText)) !== null) {
    const major = parseInt(m[1], 10);
    const minor = parseInt(m[2], 10);
    if (major === 2 && minor >= 1 && minor <= 30) {
      const after = allText.slice(m.index + m[0].length, m.index + m[0].length + 80);
      if (/^[\s]+[А-ЯІЇЄҐA-Zа-яіїєґa-z]/.test(after)) {
        markers.push({ major, minor, index: m.index });
      }
    }
  }
  const firstByNum = new Map<number, Marker>();
  for (const mk of markers) if (!firstByNum.has(mk.minor)) firstByNum.set(mk.minor, mk);
  const ordered = [...firstByNum.values()].sort((a, b) => a.minor - b.minor);
  if (ordered.length < 2) return null;

  const steps = ordered.map((cur, i) => {
    const next = ordered[i + 1];
    const slice = allText.slice(cur.index, next ? next.index : cur.index + 800);
    const text = slice
      .replace(/^\d\.\s*\d{1,2}\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();
    return { number: `${cur.major}.${cur.minor}`, body: text };
  });

  return {
    id: newId('install'),
    type: 'installationSteps',
    heading,
    intro: '',
    steps,
  };
}

// ---- Warranty ----

function parseWarranty(pages: PageData[]): WarrantyBlockData | null {
  // Last page that mentions Гарантія
  const warrantyPage = [...pages].reverse().find((p) => /Гарант/i.test(p.text));
  if (!warrantyPage) return null;

  const text = warrantyPage.text;
  const fields = WARRANTY_TEMPLATE.fields.map((f) => ({ ...f }));

  const termMatch = text.match(/гарант[іи]йний\s+термін[^\n]+/i);
  const termText = termMatch?.[0]?.trim() ?? WARRANTY_TEMPLATE.termText;

  return {
    id: newId('warranty'),
    type: 'warranty',
    title: WARRANTY_BLOCK_TITLE,
    fields,
    termText,
    conditionText: WARRANTY_TEMPLATE.conditionText,
    caseHeading: WARRANTY_TEMPLATE.caseHeading,
    caseDocs: [...WARRANTY_TEMPLATE.caseDocs],
    reviewText: WARRANTY_TEMPLATE.reviewText,
  };
}

function makeDefaultWarranty(): WarrantyBlockData {
  return {
    id: newId('warranty'),
    type: 'warranty',
    title: WARRANTY_BLOCK_TITLE,
    fields: WARRANTY_TEMPLATE.fields.map((f) => ({ ...f })),
    termText: WARRANTY_TEMPLATE.termText,
    conditionText: WARRANTY_TEMPLATE.conditionText,
    caseHeading: WARRANTY_TEMPLATE.caseHeading,
    caseDocs: [...WARRANTY_TEMPLATE.caseDocs],
    reviewText: WARRANTY_TEMPLATE.reviewText,
  };
}

// ---- TechSpecs ----

const PROPERTY_KEYS = [
  'Матеріал',
  'Зварювання',
  'Збірка',
  'Гідравлічне випробування',
  'Випробування гідравлічне',
  'Максимальний робочий тиск',
  'Робочий тиск',
  'Максимальна робоча температура',
  'Теплоносій',
  'Покриття',
  'Комплектація',
  'Упаковка',
  'Маркування',
  'Гарантійний термін',
  'Термін гарантії',
];

function parseTechSpecs(pages: PageData[]): TechSpecsBlockData | null {
  const target = pages.find((p) => /Технічні\s+характеристики/i.test(p.text));
  if (!target) return null;

  const text = target.text;

  let standards = '';
  const stdMatch = text.match(
    /(?:Відповідно\s+до\s+стандартів|Згідно\s+ТУ[УУ]?)[:.]?\s*([^\n]+)/i
  );
  if (stdMatch) standards = stdMatch[1].trim();

  const properties: { key: string; value: string }[] = [];
  for (const key of PROPERTY_KEYS) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`${escaped}\\s*[-—–:]\\s*([^\\n]+)`, 'i');
    const m = text.match(re);
    if (m) {
      const value = m[1].trim().replace(/[.,;]+$/, '');
      if (!properties.some((p) => p.key === key)) {
        properties.push({ key, value });
      }
    }
  }

  // Table extraction is intentionally minimal — pdf.js layout makes table
  // reconstruction unreliable. We expose an empty table that the user fills.
  return {
    id: newId('specs'),
    type: 'techSpecs',
    heading: 'Технічні характеристики',
    standards,
    properties,
    table: { headers: ['Модель'], rows: [] },
  };
}

// ---- Construction legend ----

function parseConstructionLegend(pages: PageData[]): ConstructionLegendData | null {
  const target = pages.find((p) =>
    /(?:^|\n)\s*\d?\.?\s*(?:Конструкц[іи]я|Будова)\b/i.test(p.text)
  );
  if (!target) return null;

  const text = target.text;

  // Extract heading
  const headingMatch = text.match(
    /\d?\.?\s*(Конструкція[^\n]*|Будова[^\n]+)/i
  );
  const heading = headingMatch?.[1]?.trim() ?? 'Конструкція виробу';

  // Find numbered legend items: "1 - Підключення котла..." / "1 – ..." / "1. ..."
  const itemRegex = /(?:^|\n)\s*(\d{1,2})\s*[-–—.)]\s+([^\n]+)/g;
  const items: { number: number; label: string }[] = [];
  const seen = new Set<number>();
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(text)) !== null) {
    const n = parseInt(m[1], 10);
    const label = m[2].trim().replace(/[.;,]+$/, '');
    // Filter out things like dates, model codes etc by requiring Cyrillic
    if (!/[А-ЯІЇЄҐа-яіїєґ]/.test(label)) continue;
    if (label.length < 4) continue;
    if (seen.has(n)) continue;
    if (n < 1 || n > 30) continue;
    seen.add(n);
    items.push({ number: n, label });
  }
  items.sort((a, b) => a.number - b.number);

  // Detect flow lines if mentioned
  const flowLines: { color: string; label: string }[] = [];
  const flowMatches = text.match(/Лінія\s+подачі[^\n]*|Зворотн\S*\s+лінія[^\n]*/gi);
  if (flowMatches) {
    for (const fm of flowMatches) {
      const isReturn = /Зворотн/i.test(fm);
      flowLines.push({
        color: isReturn ? '#3b82f6' : '#dc2626',
        label: fm.trim(),
      });
    }
  }

  return {
    id: newId('construct'),
    type: 'constructionLegend',
    heading,
    items,
    flowLines,
  };
}

// Note: TextBlock is intentionally not auto-detected — it would catch every
// loose paragraph and create noise. User can add free-text blocks manually.
// Reference unused types so tsc doesn't complain in strict mode.
export type { TextBlockData };
