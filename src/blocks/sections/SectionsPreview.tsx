import type { SectionsData } from '../../types/instruction';

interface Props {
  data: SectionsData;
}

export function SectionsPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">{data.title}</div>
      <div style={{ marginTop: '24px' }}>
        {data.items.map((item, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
              {i + 1}. {item.heading}
            </h3>
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.6,
                color: '#334155',
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
