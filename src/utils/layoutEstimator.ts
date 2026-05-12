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

// Height in mm of a single row in an imageGrid (image + caption).
// Exported because splitOversizedElement uses the same value when
// chunking oversized grids — they must agree, otherwise we'd split
// into more chunks than the estimator predicts.
export const IMAGE_GRID_ROW_MM = 65;

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
      // Each row of cells (image + caption) is ~65mm in the current
      // renderer. The earlier 75mm estimate was pessimistic and caused
      // a 3-row grid (9 items in 3 cols) to be split unnecessarily.
      return 8 + Math.ceil(el.items.length / el.columns) * IMAGE_GRID_ROW_MM;

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

// Cohesion rules shared between the paginator (page-to-page splits)
// and the renderer (column-to-column split inside a twoColumn page).
// When this returns true, the two elements must stay together — they
// form a topical pair where separating them would orphan a list,
// caption, or warning from the subject it describes.
export function isCohesivePair(
  prev: PageElement | undefined,
  curr: PageElement
): boolean {
  if (!prev) return false;

  // Image followed by its numbered legend.
  if (prev.type === 'image' && curr.type === 'scheme') return true;

  // Heading attaches to the immediately-following block.
  if (prev.type === 'heading' && curr.type !== 'heading') return true;

  // Subsection followed by its list of details.
  if (
    prev.type === 'subsection' &&
    (curr.type === 'bulletList' || curr.type === 'numberedList')
  ) {
    return true;
  }

  // A warning right after a subsection or list is almost always a
  // qualifier of that content ("don't use these substances..." after
  // the allowed-fluids list, "boiling water under pressure" after the
  // maintenance procedure). Keep them together.
  if (
    (prev.type === 'subsection' ||
      prev.type === 'bulletList' ||
      prev.type === 'numberedList') &&
    curr.type === 'warning'
  ) {
    return true;
  }

  // Image followed by a short caption-shaped paragraph.
  if (prev.type === 'image' && curr.type === 'paragraph') {
    const txt = curr.text ?? '';
    if (txt.length < 120) return true;
  }

  return false;
}

export function estimatePageHeight(elements: PageElement[], twoColumn = false): number {
  if (twoColumn) {
    const split = balancedSplitPoint(elements);
    const heights = elements.map((e) => estimateElementHeight(e, true));
    let left = 0;
    for (let i = 0; i < split; i++) left += heights[i];
    const total = heights.reduce((s, h) => s + h, 0);
    return Math.max(left, total - left);
  }
  return elements.reduce((s, e) => s + estimateElementHeight(e), 0);
}

// Find the split point [0..elements.length) that splits the array into
// a left half (indices 0..split-1) and right half (indices split..end)
// such that both column heights are roughly balanced AND the split
// doesn't break a cohesive pair (subsection+bullet, image+scheme,
// heading+content, etc.). Mirrors the renderer's column split so both
// agree exactly. Used by both this estimator and StandardPagePreview.
export function balancedSplitPoint(elements: PageElement[]): number {
  if (elements.length <= 1) return elements.length;
  const heights = elements.map((e) => estimateElementHeight(e, true));
  const total = heights.reduce((s, h) => s + h, 0);
  const target = total / 2;

  let bestSplit = Math.ceil(elements.length / 2);
  let bestDiff = Infinity;
  let cumulative = 0;

  // Walk splits where elements[split-1] | elements[split] is the
  // boundary. Reject boundaries that split a cohesive pair.
  for (let i = 1; i < elements.length; i++) {
    cumulative += heights[i - 1];
    if (isCohesivePair(elements[i - 1], elements[i])) continue;
    const diff = Math.abs(cumulative - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }

  // Fallback: if EVERY boundary breaks cohesion (unlikely but
  // theoretically possible with a single giant cohesive chain), use
  // the count-halved split rather than failing — at least the page
  // still renders.
  if (bestDiff === Infinity) {
    return Math.ceil(elements.length / 2);
  }
  return bestSplit;
}
