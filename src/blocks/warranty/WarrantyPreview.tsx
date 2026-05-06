import type { WarrantyBlockData } from '../../types/instruction';

interface Props {
  data: WarrantyBlockData;
}

export function WarrantyPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.title}</div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
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
                  fontWeight: 700,
                  background: '#f5f5f5',
                  width: '38%',
                }}
              >
                {f.label}
              </td>
              <td
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '14px 12px',
                  minHeight: '32px',
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
          fontSize: '12px',
          fontWeight: 700,
          color: '#ff6b1a',
          marginBottom: '6px',
        }}
      >
        {data.termText}
      </div>
      <div style={{ fontSize: '11px', marginBottom: '14px', color: '#2d2d2d' }}>
        {data.conditionText}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', color: '#2d2d2d' }}>
        {data.caseHeading}
      </div>
      <ul style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '14px', paddingLeft: '18px' }}>
        {data.caseDocs.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>

      <div
        style={{
          fontSize: '10.5px',
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
