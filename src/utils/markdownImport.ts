import type {
  PageElement,
  StandardPage,
  HeadingElement,
  SubsectionElement,
  ParagraphElement,
  BulletListElement,
  NumberedListElement,
  WarningElement,
} from '../types/instruction';
import { newId } from './id';

// Lightweight Markdown-flavoured parser that turns plain-text into
// Standard pages full of typed elements. The supported syntax is a
// small subset:
//
//   # Page title              → starts a new Standard page
//   ## 1.1 Subsection title   → SubsectionElement (number + heading)
//                                Body text follows on next lines until
//                                the next block-level marker.
//   ### Heading               → HeadingElement
//   - bullet                  → BulletListElement (consecutive lines
//                                merge into one list)
//   1. step                   → NumberedListElement
//   > warning text            → WarningElement
//   any other text            → ParagraphElement
//
// Designed for paste-from-Notion/-Word style content. Not a full CommonMark.

export interface ParsedDocument {
  pages: StandardPage[];
}

export function parseMarkdownToPages(input: string): ParsedDocument {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const pages: StandardPage[] = [];
  let current: StandardPage | null = null;

  // Buffers used to merge consecutive lines of the same kind.
  let bulletBuf: string[] = [];
  let numberedBuf: { number: string; text: string }[] = [];
  let pendingSubsection: SubsectionElement | null = null;
  let paragraphBuf: string[] = [];

  const ensurePage = () => {
    if (!current) {
      current = makePage('Без назви');
      pages.push(current);
    }
    return current;
  };

  const flushBullets = () => {
    if (bulletBuf.length === 0) return;
    const el: BulletListElement = {
      id: newId('bl'),
      type: 'bulletList',
      items: bulletBuf.slice(),
    };
    pushElement(el);
    bulletBuf = [];
  };

  const flushNumbered = () => {
    if (numberedBuf.length === 0) return;
    const el: NumberedListElement = {
      id: newId('nl'),
      type: 'numberedList',
      items: numberedBuf.slice(),
    };
    pushElement(el);
    numberedBuf = [];
  };

  const flushParagraph = () => {
    if (paragraphBuf.length === 0) return;
    const text = paragraphBuf.join(' ').trim();
    paragraphBuf = [];
    if (!text) return;
    if (pendingSubsection) {
      // Plain text right after a subsection header becomes its body.
      pendingSubsection.body = pendingSubsection.body
        ? pendingSubsection.body + ' ' + text
        : text;
      return;
    }
    const el: ParagraphElement = { id: newId('p'), type: 'paragraph', text };
    pushElement(el);
  };

  const flushSubsection = () => {
    if (!pendingSubsection) return;
    pushElement(pendingSubsection);
    pendingSubsection = null;
  };

  const flushAll = () => {
    flushBullets();
    flushNumbered();
    flushParagraph();
    flushSubsection();
  };

  const pushElement = (el: PageElement) => {
    ensurePage().elements.push(el);
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line === '') {
      // Blank line breaks running buffers (paragraph, lists) but keeps
      // a pending subsection open so its body can extend across blanks.
      flushBullets();
      flushNumbered();
      flushParagraph();
      continue;
    }

    // # Page title
    const pageMatch = line.match(/^#\s+(.+)$/);
    if (pageMatch) {
      flushAll();
      current = makePage(pageMatch[1].trim());
      pages.push(current);
      continue;
    }

    // ## subsection (with optional leading number like "1.1")
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

    // ### heading
    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const el: HeadingElement = {
        id: newId('h'),
        type: 'heading',
        text: headingMatch[1].trim(),
      };
      pushElement(el);
      continue;
    }

    // > warning
    const warnMatch = line.match(/^>\s*(.+)$/);
    if (warnMatch) {
      flushAll();
      const el: WarningElement = {
        id: newId('w'),
        type: 'warning',
        level: 'warning',
        title: 'Увага!',
        body: warnMatch[1].trim(),
      };
      pushElement(el);
      continue;
    }

    // - bullet
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushNumbered();
      flushParagraph();
      flushSubsection();
      bulletBuf.push(bulletMatch[1].trim());
      continue;
    }

    // 1.2  step text  OR  1. step text
    const numMatch = line.match(/^(\d+(?:\.\d+)?)\.\s+(.+)$/);
    if (numMatch) {
      flushBullets();
      flushParagraph();
      flushSubsection();
      numberedBuf.push({ number: numMatch[1], text: numMatch[2].trim() });
      continue;
    }

    // Plain text — joins paragraph buffer (or extends pending subsection body).
    flushBullets();
    flushNumbered();
    paragraphBuf.push(line.trim());
  }

  flushAll();
  return { pages };
}

function makePage(title: string): StandardPage {
  return {
    id: newId('p'),
    type: 'standard',
    sectionTitle: title,
    elements: [],
  };
}
