// ─── Text style overrides (used by element-level font controls) ─────────────

export interface TextStyle {
  fontSize?: number;
  bold?: boolean;
}

// ─── Page elements (atomic patterns that fill a Standard page) ──────────────

export type PageElementType =
  | 'heading'
  | 'subsection'
  | 'paragraph'
  | 'bulletList'
  | 'numberedList'
  | 'table'
  | 'kvList'
  | 'scheme'
  | 'image'
  | 'imageGrid'
  | 'warning'
  | 'twoColumn'
  | 'separator';

export interface PageElementBase {
  id: string;
  type: PageElementType;
  styles?: Record<string, TextStyle>;
}

export interface HeadingElement extends PageElementBase {
  type: 'heading';
  text: string;
}

export interface SubsectionElement extends PageElementBase {
  type: 'subsection';
  number: string; // "1.1"
  heading: string;
  body: string;
}

export interface ParagraphElement extends PageElementBase {
  type: 'paragraph';
  text: string;
}

export interface BulletListElement extends PageElementBase {
  type: 'bulletList';
  items: string[];
}

export interface NumberedListItem {
  number: string;
  text: string;
}

export interface NumberedListElement extends PageElementBase {
  type: 'numberedList';
  items: NumberedListItem[];
}

export interface TableElement extends PageElementBase {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface KvListItem {
  key: string;
  value: string;
}

export interface KvListElement extends PageElementBase {
  type: 'kvList';
  title?: string;
  rows: KvListItem[];
}

export interface SchemeLegendItem {
  number: number;
  label: string;
}

export interface SchemeFlowLine {
  color: string;
  label: string;
}

export interface SchemeElement extends PageElementBase {
  type: 'scheme';
  imageUrl?: string;
  items: SchemeLegendItem[];
  flowLines: SchemeFlowLine[];
}

export interface ImageElement extends PageElementBase {
  type: 'image';
  imageUrl?: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface ImageGridItem {
  id: string;
  caption: string;
  imageUrl?: string;
}

export interface ImageGridElement extends PageElementBase {
  type: 'imageGrid';
  columns: 2 | 3 | 4;
  items: ImageGridItem[];
}

export interface WarningElement extends PageElementBase {
  type: 'warning';
  level: 'info' | 'warning' | 'danger';
  title: string;
  body: string;
}

export interface SeparatorElement extends PageElementBase {
  type: 'separator';
}

export interface TwoColumnElement extends PageElementBase {
  type: 'twoColumn';
  left: PageElement[];
  right: PageElement[];
}

export type PageElement =
  | HeadingElement
  | SubsectionElement
  | ParagraphElement
  | BulletListElement
  | NumberedListElement
  | TableElement
  | KvListElement
  | SchemeElement
  | ImageElement
  | ImageGridElement
  | WarningElement
  | TwoColumnElement
  | SeparatorElement;

// ─── Pages (top-level units) ────────────────────────────────────────────────

export type PageType = 'cover' | 'standard' | 'warranty';

export interface PageBase {
  id: string;
  type: PageType;
  styles?: Record<string, TextStyle>;
}

export interface CoverPage extends PageBase {
  type: 'cover';
  subtitle: string;
  bulletPoints: string[]; // shown as 3-column features grid
  productImages: string[];
}

export interface StandardPage extends PageBase {
  type: 'standard';
  /** Title shown on the navy section bar at the top of the content area. */
  sectionTitle: string;
  /** Optional left-side label in the bottom footer band. Defaults to sectionTitle. */
  footerLabel?: string;
  /** Optional right-of-orange-dot label, e.g. "Розд. 1.1–1.5". */
  footerLabelSecondary?: string;
  /** When true, the content area splits into two columns and elements are
   *  distributed evenly between them. Useful for two-column reading layouts. */
  twoColumn?: boolean;
  elements: PageElement[];
}

export interface WarrantyField {
  label: string;
  value: string;
}

export interface WarrantyPage extends PageBase {
  type: 'warranty';
  title: string; // big text in orange band
  fields: WarrantyField[];
  termText: string;
  conditionText: string;
  caseHeading: string;
  caseDocs: string[];
  reviewText: string;
  exclusions: string[];
}

export type Page = CoverPage | StandardPage | WarrantyPage;

// ─── Document ───────────────────────────────────────────────────────────────

export interface InstructionData {
  /** Brand-level metadata shared by every page header / footer / cover. */
  brand: string;
  brandLogoUrl?: string;
  brandTagline: string;
  productName: string;
  modelCodes: string[];
  documentType: string;
  websiteUrl: string;
  pages: Page[];
}
