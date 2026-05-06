import type { WarningCalloutData } from '../../types/instruction';
import { PdfPageShell } from '../../components/PdfPageShell';
import { warningFontStyle } from './warningCalloutStyles';

interface Props {
  data: WarningCalloutData;
}

const ICON: Record<WarningCalloutData['level'], string> = {
  info: 'i',
  warning: '⚠',
  danger: '🚫',
};

export function WarningCalloutPreview({ data }: Props) {
  const titleStyle = warningFontStyle(data, 'title');
  const bodyStyle = warningFontStyle(data, 'body');
  const isDanger = data.level === 'danger';

  return (
    <PdfPageShell footerLabel={data.title}>
      {isDanger ? (
        <div className="pdf-forbidden-box">
          <div className="pdf-forbidden-title" style={titleStyle}>
            <span>{ICON[data.level]}</span>
            {data.title}
          </div>
          <div style={{ ...bodyStyle, lineHeight: 1.55 }}>{data.body}</div>
        </div>
      ) : (
        <div className="pdf-warning-box">
          <strong style={titleStyle}>
            {ICON[data.level]} {data.title}
          </strong>
          <div style={{ ...bodyStyle, marginTop: '1mm' }}>{data.body}</div>
        </div>
      )}
    </PdfPageShell>
  );
}
