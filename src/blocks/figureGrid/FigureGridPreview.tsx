import type { FigureGridBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { figureGridFontStyle } from './figureGridStyles';

interface Props {
  data: FigureGridBlockData;
}

export function FigureGridPreview({ data }: Props) {
  const headingStyle = figureGridFontStyle(data, 'heading');
  const captionStyle = figureGridFontStyle(data, 'caption');

  return (
    <div className="pdf-page">
      <PdfSectionHeader
        eyebrow="Рисунки"
        title={data.heading}
        titleStyle={headingStyle}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: '8mm',
        }}
      >
        {data.figures.map((f) => (
          <div key={f.id} style={{ breakInside: 'avoid' }}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '8px',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {f.imageUrl ? (
                <img
                  src={f.imageUrl}
                  alt={f.caption}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>[ зображення ]</div>
              )}
            </div>
            <div
              style={{
                ...captionStyle,
                marginTop: '6px',
                color: '#475569',
                textAlign: 'center',
                letterSpacing: '0.04em',
              }}
            >
              {f.caption}
            </div>
          </div>
        ))}
      </div>

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
