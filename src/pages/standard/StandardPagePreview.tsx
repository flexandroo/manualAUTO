import type { StandardPage } from '../../types/instruction';
import { PdfPageShell } from '../../components/PdfPageShell';
import { ElementRenderer } from '../../elements/ElementRenderer';

interface Props {
  data: StandardPage;
}

export function StandardPagePreview({ data }: Props) {
  if (data.twoColumn && data.elements.length > 0) {
    const half = Math.ceil(data.elements.length / 2);
    const left = data.elements.slice(0, half);
    const right = data.elements.slice(half);
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
