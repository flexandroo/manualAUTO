import type { StandardPage, PageElement } from '../../types/instruction';
import { PdfPageShell } from '../../components/PdfPageShell';
import { ElementRenderer } from '../../elements/ElementRenderer';
import { estimateElementHeight } from '../../utils/layoutEstimator';

interface Props {
  data: StandardPage;
}

// In a two-column layout we want roughly equal column heights while
// keeping element order intact (so the reader still reads left
// top-to-bottom, then right top-to-bottom — not zig-zag). Find the
// split point along the natural order whose left-column cumulative
// height is closest to half the total. With 17 mixed elements this
// produces visibly more balanced pages than splitting by count.
function balancedSplit(elements: PageElement[]): {
  left: PageElement[];
  right: PageElement[];
} {
  if (elements.length <= 1) {
    return { left: elements, right: [] };
  }
  const heights = elements.map((e) => estimateElementHeight(e, true));
  const total = heights.reduce((s, h) => s + h, 0);
  const target = total / 2;
  let cumulative = 0;
  let bestSplit = Math.ceil(elements.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < elements.length; i++) {
    cumulative += heights[i - 1];
    const diff = Math.abs(cumulative - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }
  return {
    left: elements.slice(0, bestSplit),
    right: elements.slice(bestSplit),
  };
}

export function StandardPagePreview({ data }: Props) {
  if (data.twoColumn && data.elements.length > 0) {
    const { left, right } = balancedSplit(data.elements);
    return (
      <PdfPageShell
        footerLabel={data.footerLabel ?? data.sectionTitle}
        footerLabelSecondary={data.footerLabelSecondary}
      >
        {data.sectionTitle && (
          <div className="pdf-section-bar">{data.sectionTitle}</div>
        )}
        <div className="pdf-two-col">
          <div>
            {left.map((el) => (
              <ElementRenderer key={el.id} element={el} />
            ))}
          </div>
          <div>
            {right.map((el) => (
              <ElementRenderer key={el.id} element={el} />
            ))}
          </div>
        </div>
      </PdfPageShell>
    );
  }
  return (
    <PdfPageShell
      footerLabel={data.footerLabel ?? data.sectionTitle}
      footerLabelSecondary={data.footerLabelSecondary}
    >
      {data.sectionTitle && <div className="pdf-section-bar">{data.sectionTitle}</div>}
      {data.elements.map((el) => (
        <ElementRenderer key={el.id} element={el} />
      ))}
    </PdfPageShell>
  );
}
