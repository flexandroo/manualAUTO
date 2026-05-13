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

  /** Show the CE conformity mark. */
  ceMark: boolean;

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

  /** Global text-scale multiplier applied to every font size on the
   *  sticker (1.0 = native size; e.g. 0.85 = compact, 1.2 = bigger).
   *  Lets the user shrink/grow the whole sticker's text without
   *  fiddling with individual font sizes. */
  textScale: number;
}
