import type { TechSpecsBlockData } from '../../types/instruction';

interface Props {
  data: TechSpecsBlockData;
}

export function TechSpecsPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.heading}</div>
      </div>

      {data.standards && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '11px',
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
            fontSize: '11px',
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
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{ whiteSpace: 'pre-line' }}
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
