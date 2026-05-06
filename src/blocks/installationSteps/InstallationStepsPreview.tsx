import type { InstallationStepsBlockData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
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
    <PdfPageShell footerLabel={data.heading} footerLabelSecondary="Інструкція">
      <SectionBar style={headingStyle}>{data.heading}</SectionBar>

      {data.intro && (
        <div
          className="pdf-subsection-body"
          style={{
            ...introStyle,
            marginBottom: '5mm',
          }}
        >
          {data.intro}
        </div>
      )}

      <div>
        {data.steps.map((s, i) => (
          <div
            key={i}
            className="pdf-subsection"
            style={{
              display: 'grid',
              gridTemplateColumns: '14mm 1fr',
              gap: '4mm',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                ...numberStyle,
                color: 'var(--pdf-orange)',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 800,
                fontSize: '11pt',
                lineHeight: 1.1,
              }}
            >
              {s.number}
            </div>
            <div className="pdf-subsection-body" style={bodyStyle}>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </PdfPageShell>
  );
}
