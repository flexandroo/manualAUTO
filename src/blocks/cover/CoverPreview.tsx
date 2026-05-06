import type { CoverData } from '../../types/instruction';

interface Props {
  data: CoverData;
}

export function CoverPreview({ data }: Props) {
  return (
    <div className="pdf-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          background: '#0f172a',
          margin: '-18mm -16mm 0 -16mm',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#ea580c',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          ▲▲▲
          <br />
          {data.brand}
        </div>
      </div>
      <div className="pdf-orange-bar" style={{ marginLeft: '-16mm', marginRight: '-16mm' }} />
      <div style={{ marginTop: '40px' }}>
        <h1 className="pdf-cover-title">{data.title}</h1>
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '32px',
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: 1.7,
        }}
      >
        {data.models}
        <div style={{ marginTop: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
          {data.documentType}
        </div>
        <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>{data.subtitle}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          marginTop: '60px',
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            ✓
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          marginTop: '40px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '14px',
          minHeight: '300px',
        }}
      >
        [ Зображення продукту ]
      </div>
    </div>
  );
}
