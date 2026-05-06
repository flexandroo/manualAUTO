import type { CSSProperties } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
}

// Editorial-style block header used by every content block.
// Layout: small uppercase orange eyebrow → big dark navy title → optional
// muted subtitle. A short orange accent line pinned to the bottom border.
export function PdfSectionHeader({
  eyebrow,
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
}: Props) {
  return (
    <header className="pdf-section-header">
      {eyebrow && <div className="pdf-section-eyebrow">{eyebrow}</div>}
      <h2 className="pdf-section-title" style={titleStyle}>
        {title}
      </h2>
      {subtitle && (
        <div className="pdf-section-subtitle" style={subtitleStyle}>
          {subtitle}
        </div>
      )}
    </header>
  );
}

interface FooterProps {
  url?: string;
  pageNumber?: number;
}

// Bottom-aligned page footer with URL on the left and zero-padded page
// number on the right. The position is absolute so it always sits at the
// A4 page bottom even when content is short.
export function PdfFooter({ url = 'TERMOJET.COM.UA', pageNumber }: FooterProps) {
  return (
    <div className="pdf-footer">
      <span>{url}</span>
      {pageNumber !== undefined && (
        <span>
          {String(pageNumber).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}
