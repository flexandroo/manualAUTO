import type { TechSpecsBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { techSpecsFontStyle } from './techSpecsStyles';

interface Props {
  data: TechSpecsBlockData;
}

export function TechSpecsPreview({ data }: Props) {
  const headingStyle = techSpecsFontStyle(data, 'heading');
  const standardsStyle = techSpecsFontStyle(data, 'standards');
  const propStyle = techSpecsFontStyle(data, 'property');
  const thStyle = techSpecsFontStyle(data, 'tableHeader');
  const tdStyle = techSpecsFontStyle(data, 'tableCell');

  return (
    <div className="pdf-page">
      <PdfSectionHeader
        eyebrow="Технічні дані"
        title={data.heading}
        titleStyle={headingStyle}
      />

      {data.standards && (
        <div
          style={{
            ...standardsStyle,
            color: '#475569',
            lineHeight: 1.5,
            marginBottom: '20px',
            maxWidth: '160mm',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '9px',
              fontWeight: 700,
              color: '#ff6b1a',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginRight: '8px',
            }}
          >
            Стандарти
          </span>
          {data.standards}
        </div>
      )}

      {data.properties.length > 0 && (
        <div className="pdf-specs-list" style={{ marginBottom: '24px' }}>
          {data.properties.flatMap((p, i) => [
            <div
              key={`r-${i}-l`}
              className="pdf-specs-key"
              style={{ ...propStyle, fontWeight: 700 }}
            >
              {p.key}
            </div>,
            <div key={`r-${i}-v`} className="pdf-specs-value" style={propStyle}>
              {p.value}
            </div>,
          ])}
        </div>
      )}

      {data.table.rows.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#ff6b1a',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Порівняння моделей
          </div>
          <table className="pdf-table">
            <thead>
              <tr>
                {data.table.headers.map((h, i) => (
                  <th key={i} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{ whiteSpace: 'pre-line', ...tdStyle }}
                      className={j > 0 ? 'pdf-mono' : ''}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
