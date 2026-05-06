import type { TextBlockData } from '../../types/instruction';
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
        <div className="pdf-section-header" style={headingStyle}>
          <div className="pdf-section-header__bar" />
          <div className="pdf-section-header__text" style={headingStyle}>
            {data.heading}
          </div>
        </div>
      )}
      <div
        style={{
          ...bodyStyle,
          lineHeight: 1.6,
          color: '#2d2d2d',
          whiteSpace: 'pre-wrap',
        }}
      >
        {data.body}
      </div>
      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
