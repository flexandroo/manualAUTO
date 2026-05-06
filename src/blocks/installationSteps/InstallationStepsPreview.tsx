import type { InstallationStepsBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
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
      <PdfSectionHeader
        eyebrow="Монтаж"
        title={data.heading}
        subtitle={data.intro || undefined}
        titleStyle={headingStyle}
        subtitleStyle={introStyle}
      />

      <div>
        {data.steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '36mm 1fr',
              gap: '8mm',
              alignItems: 'flex-start',
              padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid #e2e8f0',
              breakInside: 'avoid',
            }}
          >
            <div>
              <div
                style={{
                  ...numberStyle,
                  color: '#ff6b1a',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                }}
              >
                {s.number}
              </div>
              <div
                style={{
                  width: '32px',
                  height: '2px',
                  background: '#ff6b1a',
                  marginTop: '6px',
                }}
              />
            </div>
            <p
              style={{
                ...bodyStyle,
                lineHeight: 1.6,
                color: '#1f2937',
                whiteSpace: 'pre-wrap',
                margin: 0,
                paddingTop: '2px',
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
