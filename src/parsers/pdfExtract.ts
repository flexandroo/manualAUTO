import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PageData {
  pageNumber: number;
  lines: string[];
  text: string;
}

export async function extractStructuredText(pdfFile: File): Promise<PageData[]> {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pagesData: PageData[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const lineMap = new Map<number, { x: number; text: string }[]>();
    for (const item of content.items) {
      if (!('transform' in item) || !('str' in item)) continue;
      const transform = item.transform as number[];
      const y = Math.round(transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ x: transform[4], text: item.str });
    }

    const sortedLines = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map((it) => it.text)
          .join(' ')
          .trim()
      )
      .filter((l) => l.length > 0);

    pagesData.push({ pageNumber: i, lines: sortedLines, text: sortedLines.join('\n') });
  }

  return pagesData;
}
