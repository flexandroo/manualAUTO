import type { SafetyBlockData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
import { safetyFontStyle } from './safetyStyles';

interface Props {
  data: SafetyBlockData;
}

// Splits a safety body string into a leading paragraph and bullet items.
// Bullet markers: '—', '-', '•', '·' as the first non-space character on a line.
function splitBody(body: string): { lead: string; bullets: string[] } {
  const lines = body.split(/\r?\n/);
  const bulletRe = /^\s*[—–\-•·]\s+/;
  const lead: string[] = [];
  const bullets: string[] = [];
  let bulletStarted = false;
  for (const line of lines) {
    if (bulletRe.test(line)) {
      bulletStarted = true;
      bullets.push(line.replace(bulletRe, '').trim());
    } else if (!bulletStarted && line.trim()) {
      lead.push(line.trim());
    } else if (bulletStarted && line.trim()) {
      // Continuation lines without bullet — append to last bullet
      const last = bullets.length - 1;
      if (last >= 0) bullets[last] += ' ' + line.trim();
    }
  }
  return { lead: lead.join(' '), bullets };
}

export function SafetyPreview({ data }: Props) {
  const titleStyle = safetyFontStyle(data, 'title');
  const headingStyle = safetyFontStyle(data, 'subsectionHeading');
  const bodyStyle = safetyFontStyle(data, 'subsectionBody');

  // Split into two columns evenly
  const half = Math.ceil(data.subsections.length / 2);
  const left = data.subsections.slice(0, half);
  const right = data.subsections.slice(half);

  return (
    <PdfPageShell
      footerLabel={data.title}
      footerLabelSecondary={
        data.subsections.length > 0
          ? `Розд. ${data.subsections[0].number}–${data.subsections.at(-1)?.number}`
          : undefined
      }
    >
      <SectionBar style={titleStyle}>{data.title}</SectionBar>

      <div className="pdf-two-col">
        {[left, right].map((col, ci) => (
          <div key={ci}>
            {col.map((s, i) => {
              const { lead, bullets } = splitBody(s.body);
              return (
                <div key={i} className="pdf-subsection">
                  <div className="pdf-subsection-title" style={headingStyle}>
                    <span className="pdf-subsection-num">{s.number}</span>
                    {s.heading}
                  </div>
                  {lead && (
                    <div className="pdf-subsection-body" style={bodyStyle}>
                      {lead}
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="pdf-bullet-list">
                      {bullets.map((b, j) => (
                        <li key={j} style={bodyStyle}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </PdfPageShell>
  );
}
