import { describe, it, expect } from 'vitest';
import { autoPaginate } from './autoPaginate';
import { estimateElementHeight } from './layoutEstimator';
import type { StandardPage } from '../types/instruction';
import { newId } from './id';

function makePage(elements: StandardPage['elements'], extra: Partial<StandardPage> = {}): StandardPage {
  return {
    id: newId('page'),
    type: 'standard',
    sectionTitle: 'Test',
    elements,
    ...extra,
  };
}

describe('estimateElementHeight', () => {
  it('scales subsection height with body length', () => {
    const short = estimateElementHeight({
      id: 'a', type: 'subsection', number: '1', heading: 'h', body: 'abc',
    });
    const long = estimateElementHeight({
      id: 'b', type: 'subsection', number: '1', heading: 'h', body: 'x'.repeat(800),
    });
    expect(long).toBeGreaterThan(short);
  });

  it('scales table height with row count', () => {
    const small = estimateElementHeight({
      id: 't', type: 'table', headers: ['a', 'b'], rows: [['1','2'], ['3','4']],
    });
    const big = estimateElementHeight({
      id: 't', type: 'table', headers: ['a', 'b'], rows: Array(10).fill(['x','y']),
    });
    expect(big).toBeGreaterThan(small);
  });

  it('large image is taller than small image', () => {
    const sm = estimateElementHeight({ id: 'i', type: 'image', size: 'sm', caption: '', align: 'center' });
    const lg = estimateElementHeight({ id: 'i', type: 'image', size: 'lg', caption: '', align: 'center' });
    expect(lg).toBeGreaterThan(sm);
  });

  it('imageGrid stacks rows by columns', () => {
    const oneRow = estimateElementHeight({
      id: 'g', type: 'imageGrid', columns: 3,
      items: [{id:'a', caption:''},{id:'b', caption:''},{id:'c', caption:''}],
    });
    const twoRows = estimateElementHeight({
      id: 'g', type: 'imageGrid', columns: 3,
      items: [{id:'a', caption:''},{id:'b', caption:''},{id:'c', caption:''}, {id:'d', caption:''}],
    });
    expect(twoRows).toBeGreaterThan(oneRow);
  });
});

describe('autoPaginate', () => {
  it('leaves a small page unchanged', () => {
    const page = makePage([
      { id: 'p1', type: 'paragraph', text: 'Short.' },
    ]);
    const result = autoPaginate([page]);
    expect(result).toHaveLength(1);
    expect(result[0].elements).toHaveLength(1);
  });

  it('splits a page whose content exceeds the budget', () => {
    const page = makePage(
      Array.from({ length: 30 }, (_, i) => ({
        id: `p${i}`, type: 'paragraph' as const,
        text: `Параграф ${i} ${'тексту '.repeat(60)}`,
      }))
    );
    const result = autoPaginate([page]);
    expect(result.length).toBeGreaterThan(1);
    // Total elements preserved across split pages.
    const total = result.reduce((s, p) => s + p.elements.length, 0);
    expect(total).toBe(30);
  });

  it('keeps image + scheme together even at a boundary', () => {
    // Fill almost to the budget, then add image + scheme. Without
    // cohesion the scheme would land on a fresh page.
    const filler = Array.from({ length: 6 }, (_, i) => ({
      id: `f${i}`, type: 'paragraph' as const,
      text: 'x'.repeat(380),
    }));
    const page = makePage([
      ...filler,
      { id: 'img', type: 'image' as const, caption: '', align: 'center' as const, size: 'sm' as const },
      {
        id: 'sch', type: 'scheme' as const,
        items: [{number:1, label:'a'},{number:2, label:'b'}],
        flowLines: [],
      },
    ]);
    const result = autoPaginate([page]);
    // Find the bucket that contains 'img' and check 'sch' is in the
    // same bucket.
    const bucketWithImg = result.find((p) => p.elements.some((e) => e.id === 'img'));
    expect(bucketWithImg).toBeDefined();
    expect(bucketWithImg!.elements.some((e) => e.id === 'sch')).toBe(true);
  });

  it('keeps a heading attached to its following element', () => {
    // 12 fat paragraphs, then heading + paragraph at the end.
    const filler = Array.from({ length: 12 }, (_, i) => ({
      id: `f${i}`, type: 'paragraph' as const,
      text: 'x'.repeat(380),
    }));
    const page = makePage([
      ...filler,
      { id: 'h', type: 'heading' as const, text: 'Section' },
      { id: 'p', type: 'paragraph' as const, text: 'Content.' },
    ]);
    const result = autoPaginate([page]);
    const headingBucket = result.find((p) => p.elements.some((e) => e.id === 'h'));
    expect(headingBucket).toBeDefined();
    expect(headingBucket!.elements.some((e) => e.id === 'p')).toBe(true);
  });

  it('keeps subsection followed by its bullet list together', () => {
    const filler = Array.from({ length: 8 }, (_, i) => ({
      id: `f${i}`, type: 'subsection' as const,
      number: String(i + 1), heading: `Розділ ${i}`, body: 'x'.repeat(160),
    }));
    const page = makePage([
      ...filler,
      { id: 's_last', type: 'subsection' as const, number: '9', heading: 'Last', body: 'Body.' },
      { id: 'bl', type: 'bulletList' as const, items: ['a', 'b', 'c'] },
    ]);
    const result = autoPaginate([page]);
    const subBucket = result.find((p) => p.elements.some((e) => e.id === 's_last'));
    expect(subBucket).toBeDefined();
    expect(subBucket!.elements.some((e) => e.id === 'bl')).toBe(true);
  });

  it('adds (продовження) suffix and i/N footer to split pages', () => {
    const page = makePage(
      Array.from({ length: 30 }, (_, i) => ({
        id: `p${i}`, type: 'paragraph' as const,
        text: `Параграф ${i} ${'тексту '.repeat(60)}`,
      })),
      { sectionTitle: 'Основні положення' }
    );
    const result = autoPaginate([page]);
    expect(result[0].sectionTitle).toBe('Основні положення');
    for (let i = 1; i < result.length; i++) {
      expect(result[i].sectionTitle).toMatch(/\(продовження\)$/);
    }
    expect(result[0].footerLabelSecondary).toBe(`1/${result.length}`);
  });

  it('auto-enables twoColumn for text-dense subsection pages', () => {
    const subs = Array.from({ length: 6 }, (_, i) => ({
      id: `s${i}`, type: 'subsection' as const,
      number: String(i + 1), heading: `Назва ${i}`, body: 'Короткий опис розділу.',
    }));
    const page = makePage(subs);
    const result = autoPaginate([page]);
    expect(result).toHaveLength(1);
    expect(result[0].twoColumn).toBe(true);
  });

  it('does NOT auto-twoColumn when a wide element is present', () => {
    const page = makePage([
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `s${i}`, type: 'subsection' as const,
        number: String(i + 1), heading: 'h', body: 'short',
      })),
      { id: 't', type: 'table' as const, headers: ['a','b'], rows: [['1','2']] },
    ]);
    const result = autoPaginate([page]);
    expect(result[0].twoColumn).toBeFalsy();
  });

  it('respects existing twoColumn flag without over-splitting', () => {
    // Same content as the safety-7-12 page from the real document.
    const subs = Array.from({ length: 7 }, (_, i) => ({
      id: `s${i}`, type: 'subsection' as const,
      number: String(i + 1),
      heading: `Section ${i + 1}`,
      body: 'x'.repeat(220),
    }));
    const page = makePage(subs, { twoColumn: true });
    const result = autoPaginate([page]);
    expect(result).toHaveLength(1);
    expect(result[0].twoColumn).toBe(true);
  });
});
