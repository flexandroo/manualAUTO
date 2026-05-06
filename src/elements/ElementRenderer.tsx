import type {
  BulletListElement,
  HeadingElement,
  ImageElement,
  ImageGridElement,
  KvListElement,
  NumberedListElement,
  PageElement,
  ParagraphElement,
  SchemeElement,
  SeparatorElement,
  SubsectionElement,
  TableElement,
  TwoColumnElement,
  WarningElement,
} from '../types/instruction';
import { resolveStyle } from '../utils/blockStyles';
import { ELEMENT_STYLE_DEFAULTS } from './elementStyleDefaults';

interface Props {
  element: PageElement;
}

// Renders a single PageElement to the print-ready DOM. Each pattern is
// styled via the existing CSS utility classes in pdf-print.css. User-
// configured per-key fontSize/bold overrides come in via element.styles.
export function ElementRenderer({ element }: Props) {
  switch (element.type) {
    case 'heading':
      return <HeadingRender data={element} />;
    case 'subsection':
      return <SubsectionRender data={element} />;
    case 'paragraph':
      return <ParagraphRender data={element} />;
    case 'bulletList':
      return <BulletListRender data={element} />;
    case 'numberedList':
      return <NumberedListRender data={element} />;
    case 'table':
      return <TableRender data={element} />;
    case 'kvList':
      return <KvListRender data={element} />;
    case 'scheme':
      return <SchemeRender data={element} />;
    case 'image':
      return <ImageRender data={element} />;
    case 'imageGrid':
      return <ImageGridRender data={element} />;
    case 'warning':
      return <WarningRender data={element} />;
    case 'twoColumn':
      return <TwoColumnRender data={element} />;
    case 'separator':
      return <SeparatorRender data={element} />;
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────

function s(elType: keyof typeof ELEMENT_STYLE_DEFAULTS, key: string, override?: Record<string, { fontSize?: number; bold?: boolean }>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (ELEMENT_STYLE_DEFAULTS as any)[elType]?.[key] ?? { fontSize: 11, bold: false };
  return resolveStyle(override?.[key], def);
}

// ─── individual renderers ────────────────────────────────────────────────

function HeadingRender({ data }: { data: HeadingElement }) {
  return (
    <div className="pdf-section-bar" style={s('heading', 'text', data.styles)}>
      {data.text}
    </div>
  );
}

function SubsectionRender({ data }: { data: SubsectionElement }) {
  return (
    <div className="pdf-subsection">
      <div className="pdf-subsection-title">
        <span className="pdf-subsection-num" style={s('subsection', 'number', data.styles)}>
          {data.number}
        </span>
        <span style={s('subsection', 'heading', data.styles)}>{data.heading}</span>
      </div>
      <div
        className="pdf-subsection-body"
        style={{ whiteSpace: 'pre-wrap', ...s('subsection', 'body', data.styles) }}
      >
        {data.body}
      </div>
    </div>
  );
}

function ParagraphRender({ data }: { data: ParagraphElement }) {
  return (
    <div
      className="pdf-subsection-body"
      style={{
        marginBottom: '4mm',
        whiteSpace: 'pre-wrap',
        ...s('paragraph', 'text', data.styles),
      }}
    >
      {data.text}
    </div>
  );
}

function BulletListRender({ data }: { data: BulletListElement }) {
  const itemStyle = s('bulletList', 'item', data.styles);
  return (
    <ul className="pdf-bullet-list" style={{ marginBottom: '4mm' }}>
      {data.items.map((item, i) => (
        <li key={i} style={itemStyle}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function NumberedListRender({ data }: { data: NumberedListElement }) {
  const numStyle = s('numberedList', 'number', data.styles);
  const textStyle = s('numberedList', 'text', data.styles);
  return (
    <div style={{ marginBottom: '4mm' }}>
      {data.items.map((item, i) => (
        <div
          key={i}
          className="pdf-subsection"
          style={{
            display: 'grid',
            gridTemplateColumns: '14mm 1fr',
            gap: '4mm',
            alignItems: 'flex-start',
            marginBottom: '3mm',
          }}
        >
          <div
            style={{
              ...numStyle,
              color: 'var(--pdf-orange)',
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1.1,
            }}
          >
            {item.number}
          </div>
          <div
            className="pdf-subsection-body"
            style={{ whiteSpace: 'pre-wrap', margin: 0, ...textStyle }}
          >
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function TableRender({ data }: { data: TableElement }) {
  const thStyle = s('table', 'header', data.styles);
  const tdStyle = s('table', 'cell', data.styles);
  return (
    <table className="pdf-table" style={{ marginBottom: '4mm' }}>
      <thead>
        <tr>
          {data.headers.map((h, i) => (
            <th key={i} style={thStyle}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
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
  );
}

function KvListRender({ data }: { data: KvListElement }) {
  const titleStyle = s('kvList', 'title', data.styles);
  const keyStyle = s('kvList', 'key', data.styles);
  const valueStyle = s('kvList', 'value', data.styles);
  return (
    <div style={{ marginBottom: '4mm' }}>
      {data.title && (
        <div
          style={{
            ...titleStyle,
            color: 'var(--pdf-navy)',
            opacity: 0.7,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '2mm',
          }}
        >
          {data.title}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i}>
              <td
                style={{
                  padding: '1.5mm 0',
                  borderBottom: '0.5px solid rgba(13,21,38,0.07)',
                  color: 'var(--pdf-navy)',
                  opacity: 0.8,
                  width: '45%',
                  ...keyStyle,
                }}
              >
                {r.key}
              </td>
              <td
                style={{
                  padding: '1.5mm 0',
                  borderBottom: '0.5px solid rgba(13,21,38,0.07)',
                  ...valueStyle,
                }}
              >
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchemeRender({ data }: { data: SchemeElement }) {
  const numStyle = s('scheme', 'number', data.styles);
  const labelStyle = s('scheme', 'label', data.styles);
  const flowStyle = s('scheme', 'flow', data.styles);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5mm',
        marginBottom: '5mm',
        border: '0.5px solid rgba(13,21,38,0.1)',
        padding: '4mm',
        background: 'rgba(13,21,38,0.015)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60mm',
        }}
      >
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '90mm', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              color: 'var(--pdf-mid)',
              fontSize: '7pt',
              fontFamily: 'monospace',
              border: '1px dashed rgba(13,21,38,0.15)',
              padding: '10mm',
              background: 'rgba(13,21,38,0.02)',
            }}
          >
            [ Схема ]
          </div>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: '7pt',
            fontWeight: 700,
            color: 'var(--pdf-navy)',
            opacity: 0.7,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '3mm',
          }}
        >
          Конструктивні елементи
        </div>
        <ul className="pdf-component-list">
          {data.items.map((it, i) => (
            <li key={i}>
              <span className="pdf-component-num" style={numStyle}>
                {it.number}
              </span>
              <span style={labelStyle}>{it.label}</span>
            </li>
          ))}
        </ul>
        {data.flowLines.length > 0 && (
          <div
            style={{
              marginTop: '4mm',
              paddingTop: '3mm',
              borderTop: '0.5px solid rgba(13,21,38,0.08)',
            }}
          >
            {data.flowLines.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '2mm',
                  ...flowStyle,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '3px',
                    background: f.color,
                    borderRadius: '2px',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageRender({ data }: { data: ImageElement }) {
  const sizeMap = { sm: '40mm', md: '70mm', lg: '110mm', full: 'auto' } as const;
  const maxW = sizeMap[data.size ?? 'md'];
  const align = data.align ?? 'center';
  const justify =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  const captionStyle = s('image', 'caption', data.styles);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: justify,
        marginBottom: '4mm',
      }}
    >
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={data.caption ?? ''}
          style={{
            maxWidth: data.size === 'full' ? '100%' : maxW,
            height: 'auto',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: data.size === 'full' ? '100%' : maxW,
            minHeight: '40mm',
            border: '1px dashed rgba(13,21,38,0.15)',
            background: 'rgba(13,21,38,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--pdf-mid)',
            fontSize: '7pt',
            fontFamily: 'monospace',
          }}
        >
          [ зображення ]
        </div>
      )}
      {data.caption && (
        <div
          style={{
            ...captionStyle,
            color: 'var(--pdf-navy)',
            opacity: 0.7,
            marginTop: '2mm',
          }}
        >
          {data.caption}
        </div>
      )}
    </div>
  );
}

function ImageGridRender({ data }: { data: ImageGridElement }) {
  const captionStyle = s('imageGrid', 'caption', data.styles);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
        gap: '5mm',
        marginBottom: '4mm',
      }}
    >
      {data.items.map((f) => (
        <div key={f.id} className="pdf-drawing-card">
          <div className="pdf-drawing-card-title" style={captionStyle}>
            {f.caption}
          </div>
          {f.imageUrl ? (
            <img
              src={f.imageUrl}
              alt={f.caption}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          ) : (
            <div
              style={{
                background: 'var(--pdf-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40mm',
                fontSize: '7pt',
                color: 'var(--pdf-mid)',
                fontFamily: 'monospace',
                border: '1px dashed rgba(13,21,38,0.15)',
              }}
            >
              [ зображення ]
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WarningRender({ data }: { data: WarningElement }) {
  const titleStyle = s('warning', 'title', data.styles);
  const bodyStyle = s('warning', 'body', data.styles);
  if (data.level === 'danger') {
    return (
      <div className="pdf-forbidden-box">
        <div className="pdf-forbidden-title" style={titleStyle}>
          <span>🚫</span>
          {data.title}
        </div>
        <div style={{ ...bodyStyle, lineHeight: 1.55 }}>{data.body}</div>
      </div>
    );
  }
  const icon = data.level === 'info' ? 'ℹ' : '⚠';
  return (
    <div className="pdf-warning-box">
      <strong style={titleStyle}>
        {icon} {data.title}
      </strong>
      <div style={{ marginTop: '1mm', ...bodyStyle }}>{data.body}</div>
    </div>
  );
}

function TwoColumnRender({ data }: { data: TwoColumnElement }) {
  return (
    <div className="pdf-two-col" style={{ marginBottom: '4mm' }}>
      <div>
        {data.left.map((el) => (
          <ElementRenderer key={el.id} element={el} />
        ))}
      </div>
      <div>
        {data.right.map((el) => (
          <ElementRenderer key={el.id} element={el} />
        ))}
      </div>
    </div>
  );
}

function SeparatorRender({}: { data: SeparatorElement }) {
  return <div className="pdf-sep" />;
}
