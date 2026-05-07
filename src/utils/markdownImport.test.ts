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

  it('parses GFM-style tables', () => {
    const md = '# P\n| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |';
    const el = parseMarkdownToPages(md).pages[0].elements[0];
    expect(el.type).toBe('table');
    if (el.type === 'table') {
      expect(el.headers).toEqual(['A', 'B']);
      expect(el.rows).toEqual([
        ['1', '2'],
        ['3', '4'],
      ]);
    }
  });

  it('parses [kv: title] blocks', () => {
    const md = '# P\n[kv: Характеристики]\nМатеріал: сталь\nТиск: 6 бар';
    const el = parseMarkdownToPages(md).pages[0].elements[0];
    expect(el.type).toBe('kvList');
    if (el.type === 'kvList') {
      expect(el.title).toBe('Характеристики');
      expect(el.rows).toEqual([
        { key: 'Матеріал', value: 'сталь' },
        { key: 'Тиск', value: '6 бар' },
      ]);
    }
  });

  it('parses [grid: N] image grid blocks', () => {
    const md = '# P\n[grid: 4]\n- a\n- b\n- c\n- d';
    const el = parseMarkdownToPages(md).pages[0].elements[0];
    expect(el.type).toBe('imageGrid');
    if (el.type === 'imageGrid') {
      expect(el.columns).toBe(4);
      expect(el.items.map((i) => i.caption)).toEqual(['a', 'b', 'c', 'd']);
    }
  });

  it('parses [scheme] blocks', () => {
    const md = '# P\n[scheme]\n1. Підключення котла\n2. Захисний клапан';
    const el = parseMarkdownToPages(md).pages[0].elements[0];
    expect(el.type).toBe('scheme');
    if (el.type === 'scheme') {
      expect(el.items).toEqual([
        { number: 1, label: 'Підключення котла' },
        { number: 2, label: 'Захисний клапан' },
      ]);
    }
  });

  it('parses [image: caption] as a placeholder', () => {
    const md = '# P\n[image: Загальний вигляд]';
    const el = parseMarkdownToPages(md).pages[0].elements[0];
    expect(el.type).toBe('image');
    if (el.type === 'image') expect(el.caption).toBe('Загальний вигляд');
  });

  it('parses --- as separator element', () => {
    const md = '# P\nfoo\n---\nbar';
    const els = parseMarkdownToPages(md).pages[0].elements;
    expect(els.map((e) => e.type)).toEqual(['paragraph', 'separator', 'paragraph']);
  });

  it('parses warning level prefix [danger] [info]', () => {
    const md = '# P\n> [danger] Гаряче\n\n> [info] Зверніть увагу';
    const els = parseMarkdownToPages(md).pages[0].elements;
    expect(els[0].type).toBe('warning');
    expect(els[1].type).toBe('warning');
    if (els[0].type === 'warning') expect(els[0].level).toBe('danger');
    if (els[1].type === 'warning') expect(els[1].level).toBe('info');
  });
});
