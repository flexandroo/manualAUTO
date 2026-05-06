// Migrates the OLD blocks-based InstructionData (saved in localStorage from
// previous sessions) to the NEW pages-based InstructionData. Falls back to
// makeInitialData if the saved value is unrecognised.

import type {
  CoverPage,
  InstructionData,
  PageElement,
  StandardPage,
  WarrantyPage,
} from '../types/instruction';
import { newId } from './id';
import { makeInitialData } from '../data/initialData';

interface OldBlockBase {
  id?: string;
  type?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

// Detect a body that contains bullet markers and split it into a leading
// paragraph + a bullet list. Used when migrating Safety subsections.
function splitBulletBody(body: string): { lead: string; bullets: string[] } {
  const lines = body.split(/\r?\n/);
  const re = /^\s*[—–\-•·]\s+/;
  const lead: string[] = [];
  const bullets: string[] = [];
  let started = false;
  for (const line of lines) {
    if (re.test(line)) {
      started = true;
      bullets.push(line.replace(re, '').trim());
    } else if (!started && line.trim()) {
      lead.push(line.trim());
    } else if (started && line.trim()) {
      const last = bullets.length - 1;
      if (last >= 0) bullets[last] += ' ' + line.trim();
    }
  }
  return { lead: lead.join('\n'), bullets };
}

// We import Page lazily to avoid circulars
type Page = CoverPage | StandardPage | WarrantyPage;

function blockToPages(block: Any): Page[] {
  const out: Page[] = [];
  if (!block?.type) return out;

  if (block.type === 'cover') {
    out.push({
      id: block.id ?? newId('cover'),
      type: 'cover',
      heroPrefix: typeof block.heroPrefix === 'string' ? block.heroPrefix : 'Серія',
      heroAccent: typeof block.heroAccent === 'string' ? block.heroAccent : '',
      subtitle: block.subtitle ?? 'Інструкція з монтажу та експлуатації',
      bulletPoints: Array.isArray(block.bulletPoints) ? block.bulletPoints : [],
      productImages: Array.isArray(block.productImages)
        ? block.productImages
        : block.imageUrl
        ? [block.imageUrl]
        : [],
      elements: Array.isArray(block.elements) ? block.elements : [],
    } satisfies CoverPage);
    return out;
  }

  if (block.type === 'warranty') {
    out.push({
      id: block.id ?? newId('warranty'),
      type: 'warranty',
      title: block.title ?? 'Гарантійний талон',
      fields: Array.isArray(block.fields) ? block.fields : [],
      termText: block.termText ?? '',
      conditionText: block.conditionText ?? '',
      caseHeading: block.caseHeading ?? '',
      caseDocs: Array.isArray(block.caseDocs) ? block.caseDocs : [],
      reviewText: block.reviewText ?? '',
      exclusions: Array.isArray(block.exclusions) ? block.exclusions : [],
    } satisfies WarrantyPage);
    return out;
  }

  if (block.type === 'safety') {
    const subsections: Any[] = Array.isArray(block.subsections) ? block.subsections : [];
    const half = Math.ceil(subsections.length / 2);
    const groups = [
      { items: subsections.slice(0, half), suffix: 'Розд. 1.1–1.5' },
      { items: subsections.slice(half), suffix: `Розд. ${subsections[half]?.number ?? '1.6'}–${subsections.at(-1)?.number ?? '1.12'}` },
    ].filter((g) => g.items.length > 0);
    for (const [gi, g] of groups.entries()) {
      const elements: PageElement[] = [];
      for (const s of g.items) {
        const { lead, bullets } = splitBulletBody(s.body ?? '');
        elements.push({
          id: newId('s'),
          type: 'subsection',
          number: s.number ?? '',
          heading: s.heading ?? '',
          body: lead,
        });
        if (bullets.length > 0) {
          elements.push({ id: newId('bl'), type: 'bulletList', items: bullets });
        }
      }
      out.push({
        id: gi === 0 ? block.id ?? newId('page') : newId('page'),
        type: 'standard',
        sectionTitle: gi === 0 ? block.title ?? 'Основні положення' : `${block.title ?? 'Основні положення'} (продовження)`,
        footerLabel: block.title ?? 'Основні положення',
        footerLabelSecondary: g.suffix,
        twoColumn: gi === 1, // second page two-column
        elements,
      });
    }
    return out;
  }

  if (block.type === 'text') {
    const elements: PageElement[] = [];
    if (block.body) {
      elements.push({ id: newId('p'), type: 'paragraph', text: block.body });
    }
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: block.heading ?? 'Розділ',
      elements,
    });
    return out;
  }

  if (block.type === 'installationSteps') {
    const elements: PageElement[] = [];
    if (block.intro) {
      elements.push({ id: newId('p'), type: 'paragraph', text: block.intro });
    }
    if (Array.isArray(block.steps) && block.steps.length > 0) {
      elements.push({
        id: newId('nl'),
        type: 'numberedList',
        items: block.steps.map((s: Any) => ({
          number: s.number ?? '',
          text: s.body ?? '',
        })),
      });
    }
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: block.heading ?? 'Інструкція з монтажу',
      footerLabel: 'Монтаж',
      elements,
    });
    return out;
  }

  if (block.type === 'techSpecs') {
    const elements: PageElement[] = [];
    if (Array.isArray(block.properties) && block.properties.length > 0) {
      elements.push({
        id: newId('kv'),
        type: 'kvList',
        title: 'Виробництво',
        rows: block.properties.map((p: Any) => ({ key: p.key ?? '', value: p.value ?? '' })),
      });
    }
    if (block.standards) {
      elements.push({ id: newId('p'), type: 'paragraph', text: block.standards });
    }
    if (block.table?.rows?.length > 0) {
      elements.push({
        id: newId('t'),
        type: 'table',
        headers: block.table.headers ?? [],
        rows: block.table.rows ?? [],
      });
    }
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: block.heading ?? 'Технічні характеристики',
      footerLabel: 'Характеристики',
      elements,
    });
    return out;
  }

  if (block.type === 'constructionLegend') {
    const elements: PageElement[] = [
      {
        id: newId('sch'),
        type: 'scheme',
        imageUrl: block.imageUrl,
        items: Array.isArray(block.items) ? block.items : [],
        flowLines: Array.isArray(block.flowLines) ? block.flowLines : [],
      },
    ];
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: block.heading ?? 'Конструкція',
      footerLabel: 'Конструкція',
      elements,
    });
    return out;
  }

  if (block.type === 'figureGrid') {
    const elements: PageElement[] = [
      {
        id: newId('ig'),
        type: 'imageGrid',
        columns: block.columns ?? 3,
        items: Array.isArray(block.figures) ? block.figures : [],
      },
    ];
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: block.heading ?? 'Габаритні розміри',
      footerLabel: 'Розміри',
      elements,
    });
    return out;
  }

  if (block.type === 'warningCallout') {
    const elements: PageElement[] = [
      {
        id: newId('w'),
        type: 'warning',
        level: block.level ?? 'warning',
        title: block.title ?? 'Увага!',
        body: block.body ?? '',
      },
    ];
    out.push({
      id: block.id ?? newId('page'),
      type: 'standard',
      sectionTitle: 'Попередження',
      footerLabel: 'Попередження',
      elements,
    });
    return out;
  }

  return out;
}

export function migrateOldBlocksToPages(raw: Any): InstructionData | null {
  if (!raw || typeof raw !== 'object') return null;

  // Already in the new shape
  if (Array.isArray(raw.pages)) return raw as InstructionData;

  // Old shape: blocks array
  if (!Array.isArray(raw.blocks)) return null;

  const cover = raw.blocks.find((b: OldBlockBase) => b?.type === 'cover');
  // Doc-level metadata used to live on the cover block in the old schema
  const doc: Partial<InstructionData> = {
    brand: cover?.brand ?? 'TERMOJET',
    brandTagline: cover?.brandTagline ?? 'обладнання для котелень',
    productName: cover?.productName ?? raw.productName ?? 'Назва продукту',
    modelCodes: Array.isArray(cover?.modelCodes) ? cover.modelCodes : [],
    documentType: cover?.documentType ?? 'ТЕХНІЧНИЙ ПАСПОРТ',
    websiteUrl: cover?.websiteUrl ?? 'TERMOJET.COM.UA',
    brandLogoUrl: cover?.brandLogoUrl,
  };

  const pages: Page[] = [];
  for (const b of raw.blocks) {
    pages.push(...blockToPages(b));
  }
  if (pages.length === 0) return makeInitialData();

  return {
    brand: doc.brand!,
    brandTagline: doc.brandTagline!,
    productName: doc.productName!,
    modelCodes: doc.modelCodes!,
    documentType: doc.documentType!,
    websiteUrl: doc.websiteUrl!,
    brandLogoUrl: doc.brandLogoUrl,
    coverCopyright: typeof raw.coverCopyright === 'string' ? raw.coverCopyright : '',
    coverLanguage:
      typeof raw.coverLanguage === 'string' ? raw.coverLanguage : 'UA | Українська мова',
    pages,
  };
}
