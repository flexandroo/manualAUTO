// Data model for a product sticker / label (the "FERRO ZMVA230" style
// physical sticker that ships on a product box). Schema is intentionally
// flat with optional fields rather than a free-form element list — the
// layout is fixed, only the field values change between SKUs.

export interface StickerTranslation {
  langCode: string; // e.g. "PL", "EN", "UA"
  text: string;
}

export interface StickerSpec {
  /** Short label, e.g. "P", "U", "IP". */
  key: string;
  /** Value with units, e.g. "5 W", "~230 V AC – 50 Hz". */
  value: string;
}

export interface StickerData {
  id: string;
  /** Brand wordmark text (used when no brandLogoUrl is supplied). */
  brand: string;
  brandLogoUrl?: string;

  /** Word above the product code, e.g. "symbol", "katalog". */
  productLabelPrefix: string;
  /** Big bold product code, e.g. "ZMVA230". */
  productCode: string;
  /** Quantity in the package, shown in the box icon. */
  quantity: number;

  /** Secondary code, e.g. "DZ: 0002". */
  dzCode: string;

  /** Technical spec rows shown on the right column. */
  specs: StickerSpec[];

  productImageUrl?: string;

  /** Show the CE conformity mark. */
  ceMark: boolean;

  /** EAN-13 barcode digits, e.g. "5903738245901". */
  barcodeEan13: string;

  /** Product description per language, shown in the left column list. */
  translations: StickerTranslation[];

  /** Free-form distributor / importer information block at the bottom. */
  distributorInfo: string;

  /** Physical sticker size in mm. */
  widthMm: number;
  heightMm: number;
}
