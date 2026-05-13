import type { StickerCertificationDef } from './types';

// Built-in library of conformity marks. Files live in `public/certs/`
// so Vite serves them from the site root at runtime. Adding a new mark
// = drop the image in public/certs/ and add an entry below.
export const CERTIFICATION_LIBRARY: readonly StickerCertificationDef[] = [
  {
    id: 'ce',
    label: 'CE',
    description: 'European Conformity',
    imageUrl: `${import.meta.env.BASE_URL}certs/ce.png`,
  },
  {
    id: 'eac',
    label: 'EAC',
    description: 'Eurasian Conformity',
    imageUrl: `${import.meta.env.BASE_URL}certs/eac.gif`,
  },
  {
    id: 'iso',
    label: 'ISO',
    description: 'ISO 9001',
    imageUrl: `${import.meta.env.BASE_URL}certs/iso.png`,
  },
];

export function findCertification(id: string): StickerCertificationDef | undefined {
  return CERTIFICATION_LIBRARY.find((c) => c.id === id);
}
