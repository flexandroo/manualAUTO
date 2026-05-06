import type { SafetyBlockData } from '../../types/instruction';
import { safetyFontStyle } from './safetyStyles';

interface Props {
  data: SafetyBlockData;
}

export function SafetyPreview({ data }: Props) {
  const titleStyle = safetyFontStyle(data, 'title');
  const headingStyle = safetyFontStyle(data, 'subsectionHeading');
  const bodyStyle = safetyFontStyle(data, 'subsectionBody');

  return (
    <div className="pdf-page">
      <div className="pdf-section-header" style={titleStyle}>
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text" style={titleStyle}>
          {data.title}
        </div>
      </div>

      <div
        style={{
          columnCount: 2,
          columnGap: '8mm',
          color: '#2d2d2d',
          ...bodyStyle,
          lineHeight: 1.45,
        }}
      >
        {data.subsections.map((s, i) => (
          <div
            key={i}
            style={{
              breakInside: 'avoid',
              marginBottom: '8px',
            }}
          >
            <h3
              style={{
                ...headingStyle,
                color: '#ff6b1a',
                marginBottom: '2px',
              }}
            >
              {s.number} {s.heading}
            </h3>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0, ...bodyStyle }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
