import type { FigureGridBlockData } from '../../types/instruction';
import { figureGridFontStyle } from './figureGridStyles';

interface Props {
  data: FigureGridBlockData;
}

export function FigureGridPreview({ data }: Props) {
  const headingStyle = figureGridFontStyle(data, 'heading');
  const captionStyle = figureGridFontStyle(data, 'caption');

  return (
    <div className="pdf-page">
      <div className="pdf-section-header" style={headingStyle}>
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text" style={headingStyle}>
          {data.heading}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: '8mm',
        }}
      >
        {data.figures.map((f) => (
          <div key={f.id} style={{ breakInside: 'avoid' }}>
            {f.imageUrl ? (
              <img
                src={f.imageUrl}
                alt={f.caption}
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'contain',
                  background: 'white',
                  border: '1px solid #e4e4e4',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  border: '1px dashed #d4d4d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9a9a9a',
                  fontSize: '10px',
                }}
              >
                [ зображення ]
              </div>
            )}
            <div
              style={{
                ...captionStyle,
                marginTop: '4px',
                color: '#2d2d2d',
                textAlign: 'center',
              }}
            >
              {f.caption}
            </div>
          </div>
        ))}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
