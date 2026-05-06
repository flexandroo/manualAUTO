import type { TextBlockData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
import { textFontStyle } from './textStyles';

interface Props {
  data: TextBlockData;
}

export function TextPreview({ data }: Props) {
  const headingStyle = textFontStyle(data, 'heading');
  const bodyStyle = textFontStyle(data, 'body');
  return (
    <PdfPageShell footerLabel={data.heading || 'Розділ'}>
      {data.heading && <SectionBar style={headingStyle}>{data.heading}</SectionBar>}
      <div
        style={{
          ...bodyStyle,
          fontSize: '8pt',
          lineHeight: 1.7,
          color: 'var(--pdf-text)',
          opacity: 0.85,
          whiteSpace: 'pre-wrap',
        }}
      >
        {data.body}
      </div>
    </PdfPageShell>
  );
}
