import type { PageElement, StandardPage } from '../types/instruction';
import { newId } from './id';
import { estimatePageHeight, PAGE_BUDGET_MM } from './layoutEstimator';

// Post-processes parsed StandardPages so each one fits within A4
// without manual `#` page breaks for every overflow. Respects the
// user's explicit `#` markers as logical section boundaries; within a
// section, splits content into multiple pages when its estimated
// height exceeds the page budget. Honours cohesion rules so an image
// stays with its scheme legend, a heading attaches to its following
// block, etc.
//
// Also opportunistically enables twoColumn on pages whose content is
// dominated by many short subsections — that's where two-column
// rendering actually compacts well.

export function autoPaginate(pages: StandardPage[]): StandardPage[] {
  return pages.flatMap(splitOversizedPage).map(autoTwoColumn);
}

function splitOversizedPage(page: StandardPage): StandardPage[] {
  // If the user already requested twoColumn, the budget effectively
  // doubles for text-heavy content — re-estimate against twoColumn to
  // avoid splitting a page that would actually fit.
  const fitsAsIs =
    estimatePageHeight(page.elements, page.twoColumn ?? false) <= PAGE_BUDGET_MM;
  if (fitsAsIs) return [page];

  const buckets: PageElement[][] = [];
  let current: PageElement[] = [];

  const flushCurrent = () => {
    if (current.length === 0) return;
    buckets.push(current);
    current = [];
  };

  const heightOf = (els: PageElement[]) =>
    estimatePageHeight(els, page.twoColumn ?? false);

  for (let i = 0; i < page.elements.length; i++) {
    const el = page.elements[i];
    const prev = page.elements[i - 1];

    // Cohesion: an element MUST stay on the same bucket as its
    // predecessor when they form a logical pair. We never break
    // between them, even if it overflows — better one slightly busy
    // page than a broken concept.
    const cohesiveWithPrev = isCohesivePair(prev, el);

    const projected = [...current, el];
    if (
      heightOf(projected) > PAGE_BUDGET_MM &&
      current.length > 0 &&
      !cohesiveWithPrev
    ) {
      flushCurrent();
    }
    current.push(el);
  }
  flushCurrent();

  // Safety: if heuristics produced 0 buckets (shouldn't happen but
  // guard anyway), return the original page untouched so we never
  // drop content.
  if (buckets.length === 0) return [page];

  return buckets.map((elements, index) => ({
    ...page,
    id: newId('page'),
    elements,
    sectionTitle:
      index === 0 ? page.sectionTitle : `${page.sectionTitle} (продовження)`,
    footerLabelSecondary:
      buckets.length > 1
        ? `${index + 1}/${buckets.length}`
        : page.footerLabelSecondary,
  }));
}

// Returns true when `curr` should never start a new page on its own
// because it logically belongs to `prev`.
function isCohesivePair(
  prev: PageElement | undefined,
  curr: PageElement
): boolean {
  if (!prev) return false;

  // Image followed by its numbered legend.
  if (prev.type === 'image' && curr.type === 'scheme') return true;

  // Heading attaches to the immediately-following block (the heading
  // is meaningless without its content).
  if (prev.type === 'heading' && curr.type !== 'heading') return true;

  // A subsection's body sometimes continues into a bullet/numbered
  // list that elaborates the subsection — keep them together.
  if (
    prev.type === 'subsection' &&
    (curr.type === 'bulletList' || curr.type === 'numberedList')
  ) {
    return true;
  }

  // An image grid's caption-row is part of the grid itself; the only
  // explicit pairing here is image followed by a caption-bearing
  // paragraph, which we keep together.
  if (prev.type === 'image' && curr.type === 'paragraph') {
    const txt = curr.text ?? '';
    // Heuristic: a "caption" is short and doesn't end with a period
    // that suggests a full sentence body of its own.
    if (txt.length < 120) return true;
  }

  return false;
}

// If a page has lots of short subsections, enable twoColumn so the
// content packs tighter without overflow. Heuristic only — never
// disable an explicit twoColumn the user set upstream.
function autoTwoColumn(page: StandardPage): StandardPage {
  if (page.twoColumn) return page;
  if (containsAnyWideElement(page.elements)) return page;

  const subs = page.elements.filter((e) => e.type === 'subsection');
  const allShort = subs.every(
    (s) => s.type === 'subsection' && (s.body?.length ?? 0) < 240
  );

  // 5+ short subsections is the threshold where twoColumn actually
  // looks better than single-column.
  if (subs.length >= 5 && allShort) {
    return { ...page, twoColumn: true };
  }
  return page;
}

// twoColumn doesn't play well with wide elements (full-width tables,
// image grids, large images). Bail out of auto-enable in those cases.
function containsAnyWideElement(els: PageElement[]): boolean {
  return els.some(
    (e) =>
      e.type === 'table' ||
      e.type === 'imageGrid' ||
      (e.type === 'image' && (e.size === 'lg' || e.size === 'md'))
  );
}
