import type { TextBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { textFontStyle } from './textStyles';

interface Props {
  data: TextBlockData;
}

export function TextPreview({ data }: Props) {
  const headingStyle = textFontStyle(data, 'heading');
  const bodyStyle = textFontStyle(data, 'body');
  return (
    <div className="pdf-page">
      {data.heading && (
        <PdfSectionHeader title={data.heading} titleStyle={headingStyle} />
      )}
      <div
        style={{
          ...bodyStyle,
          lineHeight: 1.7,
          color: '#1f2937',
          whiteSpace: 'pre-wrap',
          maxWidth: '160mm',
        }}
      >
        {data.body}
      </div>
      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
