import type { PageElement } from '../types/instruction';

// Approximate rendered height in millimetres for a single PageElement.
// The numbers are calibrated against the actual rendered output in our
// editor with the design tokens currently in play (Montserrat 9pt body,
// 14mm gutters, default vertical rhythm). They're intentionally a bit
// conservative — we'd rather overestimate and split into one extra page
// than overflow.
//
// Used by autoPaginate() to decide where to break long content into
// multiple Standard pages, and by autoTwoColumn() to decide whether a
// page would compact better with a two-column layout.

// Effective vertical text area of a Standard page in mm:
// 297mm A4 − header (~10) − footer (~10) − content padding (15 top + 6
// bottom). Round down a touch for safety so 230mm budget = 70-85% real
// fill, which leaves a comfortable margin for line-height drift.
export const PAGE_BUDGET_MM = 230;

// Approximate characters that fit on a single rendered line of body
// text in a Standard page content column. Used to convert text length
// into a line count for height estimation.
const CHARS_PER_LINE = 78;
const CHARS_PER_LINE_TWO_COL = 38;

export function estimateElementHeight(el: PageElement, twoColumn = false): number {
  const cpl = twoColumn ? CHARS_PER_LINE_TWO_COL : CHARS_PER_LINE;

  switch (el.type) {
    case 'heading':
      return 14;

    case 'subsection': {
      const headingH = 10;
      const lines = Math.max(2, Math.ceil((el.body?.length ?? 0) / cpl));
      return headingH + lines * 5;
    }

    case 'paragraph': {
      const lines = Math.max(1, Math.ceil((el.text?.length ?? 0) / cpl));
      return 6 + lines * 5;
    }

    case 'bulletList':
      return 6 + el.items.length * 6;

    case 'numberedList':
      return 6 + el.items.length * 6;

    case 'warning': {
      const lines = Math.max(2, Math.ceil((el.body?.length ?? 0) / cpl));
      return 20 + lines * 5;
    }

    case 'table': {
      // Header + each row ≈ 7mm in the current renderer.
      return 14 + el.rows.length * 7;
    }

    case 'kvList': {
      const titleH = el.title ? 12 : 4;
      return titleH + el.rows.length * 7;
    }

    case 'image':
      return el.size === 'lg' ? 130 : el.size === 'sm' ? 60 : 90;

    case 'imageGrid':
      // Each row of cells is ~70mm tall with caption.
      return 8 + Math.ceil(el.items.length / el.columns) * 75;

    case 'scheme':
      return 10 + el.items.length * 7;

    case 'twoColumn': {
      const left = el.left.reduce((s, e) => s + estimateElementHeight(e, true), 0);
      const right = el.right.reduce((s, e) => s + estimateElementHeight(e, true), 0);
      return Math.max(left, right);
    }

    case 'separator':
      return 6;
  }
}

export function estimatePageHeight(elements: PageElement[], twoColumn = false): number {
  if (twoColumn) {
    // Best estimate: alternate-distribute and take the taller column.
    let left = 0;
    let right = 0;
    for (const el of elements) {
      const h = estimateElementHeight(el, true);
      if (left <= right) left += h;
      else right += h;
    }
    return Math.max(left, right);
  }
  return elements.reduce((s, e) => s + estimateElementHeight(e), 0);
}
