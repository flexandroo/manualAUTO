import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import type {
  StandardPage,
  ParagraphElement,
  HeadingElement,
  SubsectionElement,
  BulletListElement,
} from '../types/instruction';
import { newId } from './id';

// Parses an existing PDF (typically one of the user's previous Canva-
// produced manuals) into a sequence of Standard pages. Heuristic, not
// pixel-perfect — items are grouped by line via y-position, lines with
// disproportionately large font become headings, lines starting with a
// "1.1"-style prefix become subsections, lines starting with bullet
// glyphs become list items, the rest become paragraphs.
//
// The user is expected to clean up the result rather than rely on it
// for layout. The goal is to skip the soul-destroying retyping step.

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface TextLine {
  text: string;
  fontSize: number; // approx pt
  y: number;
}

export async function parsePdfToPages(file: File): Promise<StandardPage[]> {
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
  const pages: StandardPage[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const pdfPage = await doc.getPage(i);
    const content = await pdfPage.getTextContent();
    const lines = groupItemsIntoLines(content.items);
    const stdPage = linesToStandardPage(lines, i);
    pages.push(stdPage);
  }

  await doc.destroy();
  return pages;
}

interface PdfItemLike {
  str: string;
  transform: number[];
  height?: number;
}

function groupItemsIntoLines(items: unknown[]): TextLine[] {
  const lines: TextLine[] = [];
  let last: TextLine | null = null;
  for (const raw of items) {
    const it = raw as PdfItemLike;
    if (!it || typeof it.str !== 'string') continue;
    const y = it.transform?.[5] ?? 0;
    const fontSize = Math.abs(it.transform?.[3] ?? it.height ?? 10);
    if (!it.str.trim()) {
      // Whitespace-only run typically separates words on the same line.
      if (last) last.text += ' ';
      continue;
    }
    // Same-line if y matches within a small tolerance.
    if (last && Math.abs(last.y - y) < 2) {
      last.text += it.str;
      // Track the largest font on the line so a small subscript doesn't
      // demote a heading.
      if (fontSize > last.fontSize) last.fontSize = fontSize;
    } else {
      last = { text: it.str, fontSize, y };
      lines.push(last);
    }
  }
  // Lines arrive top-to-bottom in PDF coordinates (y descending);
  // reverse so reading order matches.
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, ' ').trim() }))
    .filter((l) => l.text.length > 0);
}

function linesToStandardPage(lines: TextLine[], pageNumber: number): StandardPage {
  const elements: (ParagraphElement | HeadingElement | SubsectionElement | BulletListElement)[] =
    [];

  // Estimate the body font size as the median of all line sizes — used
  // to classify lines as "big" (heading-ish) vs "body".
  const sizes = lines.map((l) => l.fontSize).sort((a, b) => a - b);
  const median = sizes[Math.floor(sizes.length / 2)] || 10;

  let firstHeading: string | null = null;
  let bulletBuf: string[] = [];

  const flushBullets = () => {
    if (bulletBuf.length === 0) return;
    elements.push({
      id: newId('bl'),
      type: 'bulletList',
      items: bulletBuf.slice(),
    });
    bulletBuf = [];
  };

  for (const line of lines) {
    const t = line.text;
    const isLarge = line.fontSize > median * 1.4;
    const subMatch = t.match(/^([\d]+\.[\d]+(?:\.[\d]+)?)\s+(.+)$/);
    const bulletMatch = t.match(/^[•·●○■▪–-]\s+(.+)$/);

    if (bulletMatch) {
      bulletBuf.push(bulletMatch[1].trim());
      continue;
    } else {
      flushBullets();
    }

    if (subMatch) {
      elements.push({
        id: newId('s'),
        type: 'subsection',
        number: subMatch[1],
        heading: subMatch[2].trim(),
        body: '',
      });
      continue;
    }

    if (isLarge) {
      if (!firstHeading) {
        firstHeading = t;
        // Use as the page's section title rather than emitting a
        // standalone heading element above the bar.
        continue;
      }
      elements.push({ id: newId('h'), type: 'heading', text: t });
      continue;
    }

    // Body text — extend the previous subsection if any, else paragraph.
    const prev = elements[elements.length - 1];
    if (prev && prev.type === 'subsection' && !prev.body) {
      prev.body = t;
    } else if (prev && prev.type === 'subsection') {
      prev.body = `${prev.body} ${t}`;
    } else if (prev && prev.type === 'paragraph') {
      prev.text = `${prev.text} ${t}`;
    } else {
      elements.push({ id: newId('p'), type: 'paragraph', text: t });
    }
  }

  flushBullets();

  return {
    id: newId('p'),
    type: 'standard',
    sectionTitle: firstHeading || `Сторінка ${pageNumber}`,
    elements,
  };
}
