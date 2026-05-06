import { createContext, useContext, type ReactNode } from 'react';

export interface PdfDocCtx {
  productName?: string;
  productSubtitle?: string;
  pageNumber?: number;
  totalPages?: number;
  brandLogoUrl?: string;
  brand?: string;
  websiteUrl?: string;
}

const Ctx = createContext<PdfDocCtx>({});

export function PdfDocProvider({ value, children }: { value: PdfDocCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePdfDoc(): PdfDocCtx {
  return useContext(Ctx);
}
