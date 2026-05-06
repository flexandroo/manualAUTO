import type { InstallationStepsBlockData } from '../../types/instruction';
import { installationFontStyle } from './installationStepsStyles';

interface Props {
  data: InstallationStepsBlockData;
}

export function InstallationStepsPreview({ data }: Props) {
  const headingStyle = installationFontStyle(data, 'heading');
  const introStyle = installationFontStyle(data, 'intro');
  const numberStyle = installationFontStyle(data, 'stepNumber');
  const bodyStyle = installationFontStyle(data, 'stepBody');

  return (
    <div className="pdf-page">
      <div className="pdf-section-header" style={headingStyle}>
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text" style={headingStyle}>
          {data.heading}
        </div>
      </div>

      {data.intro && (
        <p
          style={{
            ...introStyle,
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
                ...numberStyle,
                color: '#ff6b1a',
                minWidth: '28px',
                lineHeight: 1.45,
              }}
            >
              {s.number}
            </span>
            <p
              style={{
                ...bodyStyle,
                flex: 1,
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
