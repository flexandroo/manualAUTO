import type { WarrantyBlockData } from '../../types/instruction';
import { warrantyFontStyle } from './warrantyStyles';

interface Props {
  data: WarrantyBlockData;
}

export function WarrantyPreview({ data }: Props) {
  const titleStyle = warrantyFontStyle(data, 'title');
  const labelStyle = warrantyFontStyle(data, 'fieldLabel');
  const valueStyle = warrantyFontStyle(data, 'fieldValue');
  const termStyle = warrantyFontStyle(data, 'termText');
  const condStyle = warrantyFontStyle(data, 'conditionText');
  const caseHeadingStyle = warrantyFontStyle(data, 'caseHeading');
  const caseDocStyle = warrantyFontStyle(data, 'caseDoc');
  const reviewStyle = warrantyFontStyle(data, 'reviewText');

  return (
    <div className="pdf-page">
      <div className="pdf-section-header" style={titleStyle}>
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text" style={titleStyle}>
          {data.title}
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '18px',
        }}
      >
        <tbody>
          {data.fields.map((f, i) => (
            <tr key={i}>
              <td
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '14px 12px',
                  background: '#f5f5f5',
                  width: '38%',
                  ...labelStyle,
                }}
              >
                {f.label}
              </td>
              <td
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '14px 12px',
                  minHeight: '32px',
                  ...valueStyle,
                }}
              >
                {f.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          ...termStyle,
          color: '#ff6b1a',
          marginBottom: '6px',
        }}
      >
        {data.termText}
      </div>
      <div style={{ ...condStyle, marginBottom: '14px', color: '#2d2d2d' }}>
        {data.conditionText}
      </div>

      <div style={{ ...caseHeadingStyle, marginBottom: '6px', color: '#2d2d2d' }}>
        {data.caseHeading}
      </div>
      <ul
        style={{
          ...caseDocStyle,
          lineHeight: 1.6,
          marginBottom: '14px',
          paddingLeft: '18px',
        }}
      >
        {data.caseDocs.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>

      <div
        style={{
          ...reviewStyle,
          color: '#3a3a3a',
          lineHeight: 1.55,
          fontStyle: 'italic',
        }}
      >
        {data.reviewText}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
