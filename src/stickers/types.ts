// Data model for a TERMOJET-style product sticker — portrait, text-
// focused, with a stack of model variants and optional insulation
// checkboxes. Mirrors the existing 94-page sticker pack so the
// generator output drops straight into the user's print workflow.

export interface StickerVariant {
  id: string;
  /** Bold model code shown in orange, e.g. "К22В.125(200)". */
  modelCode: string;
  /** Article number underneath in parentheses, e.g. "84040212". */
  articleCode: string;
  /** Barcode image (data URL or remote). Optional — set by auto-load
   *  step that matches articleCode to a file in a barcode folder. */
  barcodeImageUrl?: string;
}

export interface StickerSpecLine {
  label: string; // "Контурів", "Довжина", "Підключення"
  value: string; // "2", "180 мм", "1\" × ¾\""
}

export interface StickerData {
  id: string;

  /** Title broken into 2-4 lines, displayed big and bold at the top.
   *  e.g. ["Колектор", "розподільчий", "з виходами вгору"]. */
  titleLines: string[];

  /** Stack of product variants. Each rendered as
   *  "<modelCode> / (<articleCode>) [+ barcode]". 1-4 typical. */
  variants: StickerVariant[];

  /** Show the standard "В теплоізоляції / Без теплоізоляції" checkbox
   *  pair near the bottom. Off for products without an insulated
   *  variant (e.g. pump groups, manifolds for warm floors). */
  showInsulationCheckboxes: boolean;

  /** Free-form spec lines for simple single-model products that don't
   *  use the variants list. e.g. "Контурів: 2", "Довжина: 180 мм". */
  specs: StickerSpecLine[];

  /** Optional asterisk note shown above the footer, e.g.
   *  "*Циркуляційний насос у комплект поставки не входить". */
  footnote: string;

  /** Bottom-of-sticker URL/copyright, e.g. "www.termojet.com.ua". */
  footer: string;

  /** Physical size in mm — defaults to 100×140 (standard TERMOJET label). */
  widthMm: number;
  heightMm: number;
}
