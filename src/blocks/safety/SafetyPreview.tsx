import type { SafetyBlockData } from '../../types/instruction';

interface Props {
  data: SafetyBlockData;
}

export function SafetyPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.title}</div>
      </div>

      <div
        style={{
          columnCount: 2,
          columnGap: '8mm',
          fontSize: '9.5px',
          lineHeight: 1.45,
          color: '#2d2d2d',
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
                fontSize: '10px',
                fontWeight: 700,
                color: '#ff6b1a',
                marginBottom: '2px',
              }}
            >
              {s.number} {s.heading}
            </h3>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
