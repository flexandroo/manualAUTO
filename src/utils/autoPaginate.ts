import type { PageElement, StandardPage } from '../types/instruction';
import { newId } from './id';
import {
  estimateElementHeight,
  estimatePageHeight,
  PAGE_BUDGET_MM,
} from './layoutEstimator';

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
  return pages.flatMap(splitOversizedPage);
}

function splitOversizedPage(page: StandardPage): StandardPage[] {
  // Step 0: If any single element is itself bigger than a page (typical
  // for an imageGrid with 12+ items or a table with 30+ rows), break
  // it into multiple smaller elements first so the walker has something
  // to work with.
  const explodedElements = page.elements.flatMap(splitOversizedElement);
  if (explodedElements.length !== page.elements.length) {
    page = { ...page, elements: explodedElements };
  }

  // Step 1: Try the page as-authored. If single-column already fits,
  // we're done.
  if (estimatePageHeight(page.elements, page.twoColumn ?? false) <= PAGE_BUDGET_MM) {
    return [autoTwoColumn(page)];
  }

  // Step 2: Try twoColumn opportunistically. For text-heavy pages with
  // no wide elements, twoColumn often saves a split entirely.
  const asTwoCol = autoTwoColumn(page);
  if (
    asTwoCol.twoColumn &&
    estimatePageHeight(asTwoCol.elements, true) <= PAGE_BUDGET_MM
  ) {
    return [asTwoCol];
  }

  // Step 3: Must split. Walk elements using the twoColumn-aware budget
  // since some pages still benefit from twoColumn even after splitting.
  const useTwoCol = asTwoCol.twoColumn ?? page.twoColumn ?? false;

  const buckets: PageElement[][] = [];
  let current: PageElement[] = [];

  const flushCurrent = () => {
    if (current.length === 0) return;
    buckets.push(current);
    current = [];
  };

  const heightOf = (els: PageElement[]) => estimatePageHeight(els, useTwoCol);

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

  // Re-balance: if the last bucket is sparse (<40% fill) while its
  // predecessor is at >90%, pull elements backwards from the heavier
  // bucket so the pair ends up roughly even. Skip elements that would
  // break cohesion if moved.
  if (buckets.length >= 2) {
    const last = buckets[buckets.length - 1];
    const prevBucket = buckets[buckets.length - 2];
    const lastH = heightOf(last);
    const prevH = heightOf(prevBucket);
    if (lastH < PAGE_BUDGET_MM * 0.4 && prevH > PAGE_BUDGET_MM * 0.85) {
      // Walk backwards from end of prevBucket, moving elements to the
      // front of last while:
      //   - prevH stays above last's height (don't over-correct)
      //   - cohesion isn't broken (don't move an element that's
      //     cohesive with the one ahead of it)
      while (prevBucket.length > 1) {
        const candidate = prevBucket[prevBucket.length - 1];
        const before = prevBucket[prevBucket.length - 2];
        const candidateH = estimatePageHeight([candidate], useTwoCol);
        if (heightOf(prevBucket) - candidateH < heightOf(last) + candidateH) break;
        if (isCohesivePair(before, candidate)) break;
        prevBucket.pop();
        last.unshift(candidate);
      }
    }
  }

  // Safety: if heuristics produced 0 buckets (shouldn't happen but
  // guard anyway), return the original page untouched so we never
  // drop content.
  if (buckets.length === 0) return [page];

  return buckets.map((elements, index) => {
    const chunk: StandardPage = {
      ...page,
      id: newId('page'),
      elements,
      twoColumn: useTwoCol,
      sectionTitle:
        index === 0 ? page.sectionTitle : `${page.sectionTitle} (продовження)`,
      footerLabelSecondary:
        buckets.length > 1
          ? `${index + 1}/${buckets.length}`
          : page.footerLabelSecondary,
    };
    // After splitting, re-check whether each chunk benefits from
    // twoColumn — splitting may have shifted the balance.
    return autoTwoColumn(chunk);
  });
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

// Decide whether a page would render more compactly in twoColumn mode.
// Two-column packs better when content is predominantly text-shaped
// (subsections, paragraphs, lists) — wide elements like tables and
// image grids would clip badly, so we abstain in those cases. We also
// abstain if twoColumn doesn't actually save meaningful space (the
// 15% threshold filters out tiny savings that aren't worth the harder
// reading flow).
function autoTwoColumn(page: StandardPage): StandardPage {
  if (page.twoColumn) return page;
  if (containsAnyWideElement(page.elements)) return page;

  const hasSubsections = page.elements.some((e) => e.type === 'subsection');
  if (!hasSubsections) return page;

  const singleH = estimatePageHeight(page.elements, false);
  const twoColH = estimatePageHeight(page.elements, true);
  if (twoColH < singleH * 0.85) {
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

// If a single element is itself larger than a whole page, slice it into
// multiple smaller elements so the walker has somewhere to break.
// Common cases: an imageGrid with 12 items needing 2 grids of 6, or a
// table with too many rows. Elements that genuinely can't be sliced
// (lg images, schemes, kvList) are returned unchanged — the walker
// will let them overflow rather than corrupt content.
function splitOversizedElement(el: PageElement): PageElement[] {
  // Keep one row of breathing room beyond what fits, to leave space
  // for surrounding content on the same page.
  if (estimateElementHeight(el) <= PAGE_BUDGET_MM) return [el];

  if (el.type === 'imageGrid') {
    const rowH = 75;
    const maxRows = Math.max(1, Math.floor((PAGE_BUDGET_MM - 8) / rowH));
    const itemsPerChunk = Math.max(1, maxRows * el.columns);
    if (el.items.length <= itemsPerChunk) return [el];
    const out: PageElement[] = [];
    for (let i = 0; i < el.items.length; i += itemsPerChunk) {
      out.push({
        ...el,
        id: newId('ig'),
        items: el.items.slice(i, i + itemsPerChunk),
      });
    }
    return out;
  }

  if (el.type === 'table') {
    const rowH = 7;
    const headerH = 14;
    const maxRows = Math.max(2, Math.floor((PAGE_BUDGET_MM - headerH) / rowH));
    if (el.rows.length <= maxRows) return [el];
    const out: PageElement[] = [];
    for (let i = 0; i < el.rows.length; i += maxRows) {
      out.push({
        ...el,
        id: newId('t'),
        rows: el.rows.slice(i, i + maxRows),
      });
    }
    return out;
  }

  return [el];
}
