import type { StickerData } from './types';

// Loads the scraped termojet.com.ua catalog (lazy, cached) and provides
// a function that fills an existing sticker with the matching product's
// specs + photo. Articles are matched 1:1; nothing fuzzy.

export interface CatalogProduct {
  url: string;
  article: string;
  productCode: string;
  name: string;
  specs: { key: string; value: string }[];
  imageUrl: string;
  imageFile?: string;
}

export interface CatalogSnapshot {
  scrapedAt: string;
  source: string;
  matched: number;
  missing: string[];
  productsByArticle: Record<string, CatalogProduct>;
}

let snapshotPromise: Promise<CatalogSnapshot | null> | null = null;

export function loadCatalog(): Promise<CatalogSnapshot | null> {
  if (snapshotPromise) return snapshotPromise;
  const url = `${import.meta.env.BASE_URL}data/termojet-catalog.json`;
  snapshotPromise = fetch(url)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return snapshotPromise;
}

export interface PullResult {
  filledSpecs: boolean;
  filledImage: boolean;
  filledName: boolean;
}

/** Returns a new sticker with specs and image overwritten by the
 *  catalog product. The user-edited title/distributor/etc. stay
 *  intact — only spec rows, productImageUrl and (when sticker title is
 *  empty) titleLines are replaced. */
export function applyCatalogProduct(
  sticker: StickerData,
  product: CatalogProduct
): { sticker: StickerData; result: PullResult } {
  const next: StickerData = { ...sticker };
  const result: PullResult = {
    filledSpecs: false,
    filledImage: false,
    filledName: false,
  };

  if (product.specs.length > 0) {
    next.specs = product.specs.map((s) => ({ key: s.key, value: s.value }));
    result.filledSpecs = true;
  }

  const imageHref = product.imageFile
    ? `${import.meta.env.BASE_URL}${product.imageFile}`
    : product.imageUrl;
  if (imageHref) {
    next.productImageUrl = imageHref;
    result.filledImage = true;
  }

  // Only fill title if user hasn't customised it.
  const titleIsEmpty = sticker.titleLines.every((l) => !l.trim());
  if (titleIsEmpty && product.name) {
    next.titleLines = [product.name];
    result.filledName = true;
  }

  // Backfill productCode if missing.
  if (!sticker.productCode.trim() && product.productCode) {
    next.productCode = product.productCode;
  }

  return { sticker: next, result };
}
