import { pdfToPng } from 'pdf-to-png-converter';

const pages = [80, 90, 100];

try {
  const out = await pdfToPng('C:/Users/Admin/Downloads/katalogua.pdf', {
    outputFolder: 'C:/Users/Admin/AppData/Local/Temp/katpages',
    outputFileMask: 'page',
    pagesToProcess: pages,
    viewportScale: 1.6,
  });
  console.log('returned', out.length, 'entries');
  for (const p of out) {
    console.log(p.name, '->', p.path, 'content?', p.content ? p.content.length : 'no');
  }
} catch (e) {
  console.error('ERR', e.message);
  console.error(e.stack);
}
