import type { TextBlockData } from '../../types/instruction';

interface Props {
  data: TextBlockData;
}

export function TextPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      {data.heading && (
        <div className="pdf-section-header">
          <div className="pdf-section-header__bar" />
          <div className="pdf-section-header__text">{data.heading}</div>
        </div>
      )}
      <div
        style={{
          fontSize: '11px',
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
