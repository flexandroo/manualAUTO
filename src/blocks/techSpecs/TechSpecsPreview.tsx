import type { TechSpecsData } from '../../types/instruction';

interface Props {
  data: TechSpecsData;
}

export function TechSpecsPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">{data.title}</div>
      <div style={{ marginTop: '24px', fontSize: '13px', fontWeight: 700 }}>
        Відповідно до стандартів:{' '}
        <span style={{ fontWeight: 500 }}>{data.standards}</span>
      </div>
      <ul
        style={{
          marginTop: '20px',
          fontSize: '12px',
          lineHeight: 1.8,
          paddingLeft: '20px',
        }}
      >
        {data.properties.map((p, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>
            <strong>{p.key}:</strong> {p.value}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '24px' }}>
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
      </div>
    </div>
  );
}
