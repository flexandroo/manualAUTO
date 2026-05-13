// Data model for the redesigned TERMOJET sticker: single product code,
// uploadable product photo + barcode image, multilingual descriptions,
// optional spec list and distributor info block. Style stays TERMOJET
// (navy / orange / Montserrat) but information content mirrors the
// FERRO ZMVA230 reference the user sent — translations, specs, photo,
// barcode, distributor band.

export interface StickerSpecLine {
  /** Short label, e.g. "P", "U", "IP". */
  key: string;
  /** Value with units, e.g. "5 W", "~230 V AC – 50 Hz". */
  value: string;
}

export interface StickerTranslation {
  /** 2-3 letter language code, e.g. "PL", "EN", "UA". */
  langCode: string;
  /** Product description in that language. */
  text: string;
}

/** A reusable certification mark in the built-in library. Static data
 *  shipped with the app — users pick which marks to show per sticker
 *  via `selectedCertIds`. */
export interface StickerCertificationDef {
  id: string;
  /** Short text label (e.g. "CE", "EAC", "ISO"). */
  label: string;
  /** Long-form name shown in the editor tooltip. */
  description: string;
  /** Path to the mark image bundled in /public/certs/. */
  imageUrl: string;
}

/** Per-section font-size overrides in points. Any value left undefined
 *  falls back to the preview's built-in defaults. */
export interface StickerFontSizes {
  title?: number;
  productCode?: number;
  specs?: number;
  translations?: number;
  distributor?: number;
  footer?: number;
}

export interface StickerData {
  id: string;

  /** Optional brand logo (uploaded image). Shown top-left. */
  brandLogoUrl?: string;

  /** Title broken into 2-4 lines, paired with product code and article
   *  in the top-right info block. e.g. ["Колектор", "розподільчий"]. */
  titleLines: string[];

  /** Main bold product code, e.g. "ZMVA230" or "К22В.125(200)". */
  productCode: string;
  /** Article number underneath, e.g. "84040212". */
  articleCode: string;

  /** Uploaded product photo (data URL). */
  productImageUrl?: string;
  /** Uploaded barcode image (data URL) — user provides per-article
   *  barcode PNG; the system doesn't generate it. */
  barcodeImageUrl?: string;

  /** Technical spec rows (P / U / IP / etc.). Optional. */
  specs: StickerSpecLine[];

  /** Multilingual product descriptions. Each row: lang code + text. */
  translations: StickerTranslation[];

  /** Free-form distributor / importer info block on the bottom band. */
  distributorInfo: string;

  /** IDs of conformity marks (from CERTIFICATION_LIBRARY) shown
   *  right-aligned next to the barcode. */
  selectedCertIds: string[];

  /** Asterisk note shown above the footer. */
  footnote: string;

  /** Bottom URL / copyright. */
  footer: string;

  /** Physical sticker size in mm. */
  widthMm: number;
  heightMm: number;

  /** Hex colour for the decorative border lines (top + sides).
   *  Defaults to brand orange; user can override per-sticker. */
  accentColor: string;

  /** Global text-scale multiplier applied on top of per-section sizes
   *  (1.0 = native; 0.85 = compact; 1.2 = bigger). Lets the user
   *  shrink/grow the whole sticker's text with one slider. */
  textScale: number;

  /** Per-section font-size overrides in pt. Empty by default. */
  fontSizes: StickerFontSizes;
}
