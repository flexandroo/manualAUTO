import { describe, it, expect } from 'vitest';
import { parseMarkdownToPages } from './markdownImport';

describe('parseMarkdownToPages', () => {
  it('returns no pages for empty input', () => {
    expect(parseMarkdownToPages('').pages).toEqual([]);
  });

  it('treats # as a page break and uses heading as section title', () => {
    const out = parseMarkdownToPages('# First page\n# Second page');
    expect(out.pages).toHaveLength(2);
    expect(out.pages[0].sectionTitle).toBe('First page');
    expect(out.pages[1].sectionTitle).toBe('Second page');
  });

  it('parses ## with leading number as a subsection element', () => {
    const out = parseMarkdownToPages('# Page\n\n## 1.2 Призначення\nТекст підрозділу.');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('subsection');
    if (el.type === 'subsection') {
      expect(el.number).toBe('1.2');
      expect(el.heading).toBe('Призначення');
      expect(el.body).toBe('Текст підрозділу.');
    }
  });

  it('handles ## without a number', () => {
    const out = parseMarkdownToPages('# Page\n## Просто заголовок\nBody');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('subsection');
    if (el.type === 'subsection') {
      expect(el.number).toBe('');
      expect(el.heading).toBe('Просто заголовок');
    }
  });

  it('groups consecutive bullets into one BulletListElement', () => {
    const out = parseMarkdownToPages('# P\n- one\n- two\n- three');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('bulletList');
    if (el.type === 'bulletList') {
      expect(el.items).toEqual(['one', 'two', 'three']);
    }
  });

  it('starts a new bullet list after a blank line', () => {
    const out = parseMarkdownToPages('# P\n- a\n\n- b');
    expect(out.pages[0].elements.filter((e) => e.type === 'bulletList')).toHaveLength(2);
  });

  it('groups consecutive numbered items', () => {
    const out = parseMarkdownToPages('# P\n1.1 first step\n1.2 second step');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('numberedList');
    if (el.type === 'numberedList') {
      expect(el.items).toEqual([
        { number: '1.1', text: 'first step' },
        { number: '1.2', text: 'second step' },
      ]);
    }
  });

  it('treats > as a warning element', () => {
    const out = parseMarkdownToPages('# P\n> Не торкайтесь — гаряче.');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('warning');
    if (el.type === 'warning') {
      expect(el.body).toBe('Не торкайтесь — гаряче.');
    }
  });

  it('treats ### as a HeadingElement', () => {
    const out = parseMarkdownToPages('# P\n### Підзаголовок');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('heading');
    if (el.type === 'heading') expect(el.text).toBe('Підзаголовок');
  });

  it('joins plain lines into a single paragraph', () => {
    const out = parseMarkdownToPages('# P\nfirst line\nsecond line\nthird line');
    const el = out.pages[0].elements[0];
    expect(el.type).toBe('paragraph');
    if (el.type === 'paragraph') expect(el.text).toBe('first line second line third line');
  });

  it('emits a default page when content arrives before any #', () => {
    const out = parseMarkdownToPages('Hello there.');
    expect(out.pages).toHaveLength(1);
    expect(out.pages[0].sectionTitle).toBe('Без назви');
    expect(out.pages[0].elements[0].type).toBe('paragraph');
  });
});
