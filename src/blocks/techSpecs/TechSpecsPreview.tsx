import type { TechSpecsBlockData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
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

  const hasTable = data.table.rows.length > 0;
  const hasProperties = data.properties.length > 0;

  return (
    <PdfPageShell footerLabel={data.heading} footerLabelSecondary="Характеристики">
      <SectionBar style={headingStyle}>{data.heading}</SectionBar>

      {hasProperties && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5mm',
            marginBottom: '5mm',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '7pt',
                fontWeight: 700,
                color: 'var(--pdf-navy)',
                marginBottom: '2mm',
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Виробництво
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '7pt',
              }}
            >
              <tbody>
                {data.properties.map((p, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        ...propStyle,
                        padding: '1.5mm 0',
                        borderBottom: '0.5px solid rgba(13,21,38,0.07)',
                        fontWeight: 600,
                        color: 'var(--pdf-navy)',
                        opacity: 0.8,
                        width: '45%',
                      }}
                    >
                      {p.key}
                    </td>
                    <td
                      style={{
                        ...propStyle,
                        padding: '1.5mm 0',
                        borderBottom: '0.5px solid rgba(13,21,38,0.07)',
                        fontSize: '6.5pt',
                      }}
                    >
                      {p.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.standards && (
            <div>
              <div
                style={{
                  fontSize: '7pt',
                  fontWeight: 700,
                  color: 'var(--pdf-navy)',
                  marginBottom: '2mm',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Стандарти / Опис
              </div>
              <div
                style={{
                  ...standardsStyle,
                  fontSize: '7pt',
                  lineHeight: 1.65,
                  opacity: 0.8,
                }}
              >
                {data.standards}
              </div>
            </div>
          )}
        </div>
      )}

      {hasTable && (
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
                  <td key={j} style={{ whiteSpace: 'pre-line', ...tdStyle }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PdfPageShell>
  );
}
