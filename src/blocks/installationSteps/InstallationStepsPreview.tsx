import type { InstallationStepsBlockData } from '../../types/instruction';

interface Props {
  data: InstallationStepsBlockData;
}

export function InstallationStepsPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.heading}</div>
      </div>

      {data.intro && (
        <p
          style={{
            fontSize: '11px',
            lineHeight: 1.55,
            color: '#2d2d2d',
            marginBottom: '14px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {data.intro}
        </p>
      )}

      <div>
        {data.steps.map((s, i) => (
          <div
            key={i}
            style={{
              marginBottom: '12px',
              display: 'flex',
              gap: '10px',
              breakInside: 'avoid',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#ff6b1a',
                minWidth: '28px',
                lineHeight: 1.45,
              }}
            >
              {s.number}
            </span>
            <p
              style={{
                flex: 1,
                fontSize: '11px',
                lineHeight: 1.5,
                color: '#2d2d2d',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
