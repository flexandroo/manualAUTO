import type { TechSpecsBlockData } from '../../types/instruction';
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
      <div className="pdf-section-header" style={headingStyle}>
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text" style={headingStyle}>
          {data.heading}
        </div>
      </div>

      {data.standards && (
        <div
          style={{
            ...standardsStyle,
            color: '#2d2d2d',
            lineHeight: 1.5,
            marginBottom: '12px',
          }}
        >
          <strong style={{ color: '#ff6b1a' }}>Відповідно до стандартів:</strong>{' '}
          {data.standards}
        </div>
      )}

      {data.properties.length > 0 && (
        <ul
          style={{
            ...propStyle,
            lineHeight: 1.7,
            paddingLeft: '18px',
            listStyleType: 'square',
            marginBottom: '14px',
          }}
        >
          {data.properties.map((p, i) => (
            <li key={i} style={{ marginBottom: '2px' }}>
              <strong>{p.key}:</strong> {p.value}
            </li>
          ))}
        </ul>
      )}

      {data.table.rows.length > 0 && (
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
                    {j === 0 ? <strong>{cell}</strong> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
