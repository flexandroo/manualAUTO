import type {
  PageElement,
  StandardPage,
  HeadingElement,
  SubsectionElement,
  ParagraphElement,
  BulletListElement,
  NumberedListElement,
  WarningElement,
  TableElement,
  KvListElement,
  ImageElement,
  ImageGridElement,
  SchemeElement,
  SeparatorElement,
} from '../types/instruction';
import { newId } from './id';

// Markdown-flavoured parser that produces Standard pages full of typed
// elements. Designed for paste-from-Notion/Word workflows AND for
// hand-written content that needs every element type our editor
// supports — not a full CommonMark implementation.
//
// SUPPORTED SYNTAX
// ──────────────────────────────────────────────────────────────────────
// # Page title              → starts a new Standard page
// ## 1.1 Subsection title   → SubsectionElement (number optional)
//   body text               → extends the previous subsection's body
// ### Heading               → HeadingElement
// - bullet                  → BulletListElement (consecutive merge)
// 1. step / 1.1 step        → NumberedListElement (consecutive merge)
// > [danger] text           → WarningElement (level: danger|warning|info)
// > text                    → WarningElement (default level: warning)
// ---                       → SeparatorElement
//
// | a | b | c |             ┐
// |---|---|---|             │  TableElement (markdown-style)
// | 1 | 2 | 3 |             ┘
//
// [kv: Title]               ┐
// Key: Value                │  KvListElement
// Other: 42                 ┘
//
// [image: підпис]           → ImageElement placeholder (user attaches
//                             the actual file via the editor afterward)
//
// [grid: 3]                 ┐
// - підпис 1                │  ImageGridElement (number = column count)
// - підпис 2                ┘
//
// [scheme]                  ┐
// 1. Підключення котла      │  SchemeElement
// 2. Захисний клапан        ┘
//
// Anything else             → ParagraphElement (joins consecutive lines)

export interface ParsedDocument {
  pages: StandardPage[];
}

type BlockKind = 'kv' | 'grid' | 'scheme' | 'table' | null;

export function parseMarkdownToPages(input: string): ParsedDocument {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const pages: StandardPage[] = [];
  let current: StandardPage | null = null;

  let bulletBuf: string[] = [];
  let numberedBuf: { number: string; text: string }[] = [];
  let pendingSubsection: SubsectionElement | null = null;
  let paragraphBuf: string[] = [];

  // Multi-line block context (kv, grid, scheme, table). Only one is
  // ever active at a time; opening a new one flushes the previous.
  let blockKind: BlockKind = null;
  let blockMeta: string = '';
  let blockLines: string[] = [];

  const ensurePage = () => {
    if (!current) {
      current = makePage('Без назви');
      pages.push(current);
    }
    return current;
  };

  const pushElement = (el: PageElement) => {
    ensurePage().elements.push(el);
  };

  const flushBullets = () => {
    if (bulletBuf.length === 0) return;
    pushElement({
      id: newId('bl'),
      type: 'bulletList',
      items: bulletBuf.slice(),
    } satisfies BulletListElement);
    bulletBuf = [];
  };

  const flushNumbered = () => {
    if (numberedBuf.length === 0) return;
    pushElement({
      id: newId('nl'),
      type: 'numberedList',
      items: numberedBuf.slice(),
    } satisfies NumberedListElement);
    numberedBuf = [];
  };

  const flushParagraph = () => {
    if (paragraphBuf.length === 0) return;
    const text = paragraphBuf.join(' ').trim();
    paragraphBuf = [];
    if (!text) return;
    if (pendingSubsection) {
      pendingSubsection.body = pendingSubsection.body
        ? pendingSubsection.body + ' ' + text
        : text;
      return;
    }
    pushElement({ id: newId('p'), type: 'paragraph', text } satisfies ParagraphElement);
  };

  const flushSubsection = () => {
    if (!pendingSubsection) return;
    pushElement(pendingSubsection);
    pendingSubsection = null;
  };

  const flushBlock = () => {
    if (!blockKind) return;
    switch (blockKind) {
      case 'kv':
        pushElement(buildKvList(blockMeta, blockLines));
        break;
      case 'grid':
        pushElement(buildImageGrid(blockMeta, blockLines));
        break;
      case 'scheme':
        pushElement(buildScheme(blockLines));
        break;
      case 'table':
        pushElement(buildTable(blockLines));
        break;
    }
    blockKind = null;
    blockMeta = '';
    blockLines = [];
  };

  const flushAll = () => {
    flushBullets();
    flushNumbered();
    flushParagraph();
    flushSubsection();
    flushBlock();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Inside a multi-line block (except table, which sniffs separately)?
    if (blockKind && blockKind !== 'table') {
      // A blank line ends the block.
      if (line === '') {
        flushBlock();
        continue;
      }
      blockLines.push(line);
      continue;
    }

    // Table detection: starts with `|...|` and the NEXT line is a
    // separator like `|---|`. If we're already inside a table, just
    // keep accumulating until a non-pipe line arrives.
    if (blockKind === 'table') {
      if (line.startsWith('|')) {
        blockLines.push(line);
        continue;
      }
      flushBlock();
      // fall through to re-process this line
    }

    if (line === '') {
      flushBullets();
      flushNumbered();
      flushParagraph();
      continue;
    }

    // ─── Block openers ────────────────────────────────────────────────

    const tableStart =
      line.startsWith('|') && lines[i + 1]?.replace(/\s/g, '').match(/^\|[-:|]+\|$/);
    if (tableStart) {
      flushAll();
      blockKind = 'table';
      blockLines = [line];
      continue;
    }

    const kvOpen = line.match(/^\[kv(?::\s*(.+))?\]\s*$/i);
    if (kvOpen) {
      flushAll();
      blockKind = 'kv';
      blockMeta = (kvOpen[1] ?? '').trim();
      blockLines = [];
      continue;
    }

    const gridOpen = line.match(/^\[grid(?::\s*(\d+))?\]\s*$/i);
    if (gridOpen) {
      flushAll();
      blockKind = 'grid';
      blockMeta = gridOpen[1] ?? '3';
      blockLines = [];
      continue;
    }

    const schemeOpen = line.match(/^\[scheme\]\s*$/i);
    if (schemeOpen) {
      flushAll();
      blockKind = 'scheme';
      blockMeta = '';
      blockLines = [];
      continue;
    }

    const imageOpen = line.match(/^\[image(?::\s*(.+))?\]\s*$/i);
    if (imageOpen) {
      flushAll();
      pushElement({
        id: newId('img'),
        type: 'image',
        caption: (imageOpen[1] ?? '').trim(),
        align: 'center',
        size: 'md',
      } satisfies ImageElement);
      continue;
    }

    // ─── Single-line markers ──────────────────────────────────────────

    const pageMatch = line.match(/^#\s+(.+)$/);
    if (pageMatch) {
      flushAll();
      current = makePage(pageMatch[1].trim());
      pages.push(current);
      continue;
    }

    const subMatch = line.match(/^##\s+(?:([\d.]+)\s+)?(.+)$/);
    if (subMatch) {
      flushAll();
      pendingSubsection = {
        id: newId('s'),
        type: 'subsection',
        number: subMatch[1] || '',
        heading: subMatch[2].trim(),
        body: '',
      };
      continue;
    }

    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      pushElement({
        id: newId('h'),
        type: 'heading',
        text: headingMatch[1].trim(),
      } satisfies HeadingElement);
      continue;
    }

    if (line.match(/^---+$/)) {
      flushAll();
      pushElement({ id: newId('sep'), type: 'separator' } satisfies SeparatorElement);
      continue;
    }

    const warnMatch = line.match(/^>\s*(?:\[(danger|warning|info)\]\s*)?(.+)$/);
    if (warnMatch) {
      flushAll();
      const level = (warnMatch[1] as 'danger' | 'warning' | 'info' | undefined) ?? 'warning';
      const titleByLevel = { danger: 'Небезпека!', warning: 'Увага!', info: 'Примітка' } as const;
      pushElement({
        id: newId('w'),
        type: 'warning',
        level,
        title: titleByLevel[level],
        body: warnMatch[2].trim(),
      } satisfies WarningElement);
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushNumbered();
      flushParagraph();
      flushSubsection();
      bulletBuf.push(bulletMatch[1].trim());
      continue;
    }

    const numMatch = line.match(/^(\d+(?:\.\d+)+|\d+\.)\s+(.+)$/);
    if (numMatch) {
      flushBullets();
      flushParagraph();
      flushSubsection();
      const num = numMatch[1].endsWith('.') ? numMatch[1].slice(0, -1) : numMatch[1];
      numberedBuf.push({ number: num, text: numMatch[2].trim() });
      continue;
    }

    flushBullets();
    flushNumbered();
    paragraphBuf.push(line.trim());
  }

  flushAll();
  return { pages };
}

// ─── Block builders ───────────────────────────────────────────────────

function buildKvList(title: string, lines: string[]): KvListElement {
  const rows = lines
    .map((l) => l.match(/^([^:]+):\s*(.*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ key: m[1].trim(), value: m[2].trim() }));
  return {
    id: newId('kv'),
    type: 'kvList',
    title: title || undefined,
    rows,
  };
}

function buildImageGrid(colsStr: string, lines: string[]): ImageGridElement {
  const raw = parseInt(colsStr, 10) || 3;
  const columns: 2 | 3 | 4 = raw <= 2 ? 2 : raw >= 4 ? 4 : 3;
  const items = lines
    .map((l) => l.match(/^[-*]\s*(.*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ id: newId('f'), caption: m[1].trim() }));
  return { id: newId('ig'), type: 'imageGrid', columns, items };
}

function buildScheme(lines: string[]): SchemeElement {
  const items = lines
    .map((l) => l.match(/^(\d+)\.?\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ number: parseInt(m[1], 10), label: m[2].trim() }));
  return { id: newId('sch'), type: 'scheme', items, flowLines: [] };
}

function buildTable(lines: string[]): TableElement {
  // Drop the separator row and extract cells from the rest.
  const rows = lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))
    .filter((l) => !l.replace(/\s/g, '').match(/^\|[-:|]+\|$/))
    .map((l) =>
      l
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim())
    );
  const headers = rows.shift() ?? [];
  return { id: newId('t'), type: 'table', headers, rows };
}

function makePage(title: string): StandardPage {
  return {
    id: newId('p'),
    type: 'standard',
    sectionTitle: title,
    elements: [],
  };
}
