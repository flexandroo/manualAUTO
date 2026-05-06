import type { FigureGridBlockData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
import { figureGridFontStyle } from './figureGridStyles';

interface Props {
  data: FigureGridBlockData;
}

export function FigureGridPreview({ data }: Props) {
  const headingStyle = figureGridFontStyle(data, 'heading');
  const captionStyle = figureGridFontStyle(data, 'caption');

  return (
    <PdfPageShell
      footerLabel="Технічна документація"
      footerLabelSecondary={data.heading}
    >
      <SectionBar style={headingStyle}>{data.heading}</SectionBar>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: '5mm',
        }}
      >
        {data.figures.map((f) => (
          <div key={f.id} className="pdf-drawing-card">
            <div className="pdf-drawing-card-title" style={captionStyle}>
              {f.caption}
            </div>
            {f.imageUrl ? (
              <img
                src={f.imageUrl}
                alt={f.caption}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  background: 'var(--pdf-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50mm',
                  fontSize: '7pt',
                  color: 'var(--pdf-mid)',
                  fontFamily: 'monospace',
                  border: '1px dashed rgba(13,21,38,0.15)',
                }}
              >
                [ зображення ]
              </div>
            )}
          </div>
        ))}
      </div>
    </PdfPageShell>
  );
}
