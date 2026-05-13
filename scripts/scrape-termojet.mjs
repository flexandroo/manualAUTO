// Crawls termojet.com.ua starting at /catalog/, collects every product
// page, then extracts article + product code + name + spec table +
// hero image for each. Filters to articles present in
// public/data/sofievka.json. Downloads images to public/products/ and
// writes the catalog to public/data/termojet-catalog.json.
//
// Pure stdlib — no cheerio, no fetch deps. Built for GitHub Actions:
// run weekly + manually, commit any diff.
//
//   node scripts/scrape-termojet.mjs                  // full run
//   node scripts/scrape-termojet.mjs --limit 10       // smoke test
//   node scripts/scrape-termojet.mjs --skip-images    // metadata only

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ORIGIN = 'https://termojet.com.ua';
const ENTRY = `${ORIGIN}/catalog/`;
const SOFIEVKA = resolve(ROOT, 'public/data/sofievka.json');
const OUT_JSON = resolve(ROOT, 'public/data/termojet-catalog.json');
const OUT_IMAGES = resolve(ROOT, 'public/products');
const CONCURRENCY = 4;
const REQ_TIMEOUT_MS = 20_000;
const USER_AGENT = 'manualAUTO-scraper/1.0 (+https://github.com/flexandroo/manualAUTO)';

const args = new Set(process.argv.slice(2));
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;
const SKIP_IMAGES = args.has('--skip-images');

const stripTags = (s) =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQ_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...opts,
      signal: ctrl.signal,
      headers: { 'User-Agent': USER_AGENT, ...(opts.headers || {}) },
    });
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(url) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ─── crawl ────────────────────────────────────────────────────────────────

function extractCatalogLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="([^"]+)"/gi)) {
    const href = m[1];
    if (
      href.startsWith(`${ORIGIN}/product-category/`) ||
      href.startsWith(`${ORIGIN}/product/`)
    ) {
      const clean = href.split('#')[0].split('?')[0];
      out.add(clean);
    }
  }
  return [...out];
}

async function crawl() {
  const visited = new Set();
  const productUrls = new Set();
  const queue = [ENTRY];

  while (queue.length) {
    const batch = queue.splice(0, CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (url) => {
        if (visited.has(url)) return [];
        visited.add(url);
        try {
          const html = await fetchText(url);
          return extractCatalogLinks(html);
        } catch (e) {
          console.warn(`  fail ${url}: ${e.message}`);
          return [];
        }
      })
    );

    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      for (const link of r.value) {
        if (visited.has(link)) continue;
        if (link.includes('/product/')) {
          productUrls.add(link);
        } else if (link.includes('/product-category/')) {
          queue.push(link);
        }
      }
    }
    console.log(`  crawled ${visited.size}, queue ${queue.length}, products ${productUrls.size}`);
  }

  return [...productUrls];
}

// ─── parse product page ───────────────────────────────────────────────────

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : '';
}

function extractSpecTable(html) {
  // Tablepress rows: <td class="column-1">key</td><td class="column-2">value</td>
  const tableMatch = html.match(/<table[^>]*tablepress[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [];
  const out = [];
  const rowRe =
    /<td[^>]*class="column-1"[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*class="column-2"[^>]*>([\s\S]*?)<\/td>/gi;
  for (const m of tableMatch[1].matchAll(rowRe)) {
    const key = stripTags(m[1]);
    const value = stripTags(m[2]);
    if (!key || !value) continue;
    out.push({ key, value });
  }
  return out;
}

function extractArticleFromSpecs(specs, fallbackHtml) {
  const row = specs.find((s) => /артикул/i.test(s.key));
  if (row) return row.value.trim();
  const m = fallbackHtml.match(/Артикул[:\s]*([A-ZА-ЯЁЇІЄҐ0-9.\-/()]+)/i);
  return m ? m[1].trim() : '';
}

function parseHeadline(h1) {
  // "К22В.125(240) Колектор в теплоізоляції 2+1 вгору"
  // -> productCode = "К22В.125(240)", name = "Колектор в теплоізоляції 2+1 вгору"
  const m = h1.match(/^(\S+)\s+([\s\S]*)$/);
  if (m && /[A-ZА-Я0-9]/i.test(m[1])) {
    return { productCode: m[1].trim(), name: m[2].trim() };
  }
  return { productCode: '', name: h1.trim() };
}

function pickHeroImage(html) {
  const re =
    /https?:\/\/termojet\.com\.ua\/wp-content\/uploads\/(\d{4})\/(\d{2})\/([^"'?>\s]+\.(jpg|jpeg|png|webp))/gi;
  const candidates = [];
  for (const m of html.matchAll(re)) {
    const url = m[0];
    const file = m[3];
    // Skip site chrome
    if (/logo|cropped-fav|icon|favicon|sprite/i.test(file)) continue;
    // Skip very small thumbnails
    if (/-(?:60|75|100|120|150|180)x\d+\./i.test(file)) continue;
    candidates.push(url);
  }
  if (!candidates.length) return '';
  // Prefer the largest 800-band size if multiple sizes of same base file
  const preferred = candidates.find((u) => /-800x\d+\./i.test(u));
  return preferred || candidates[0];
}

async function parseProduct(url) {
  const html = await fetchText(url);
  const h1 = extractH1(html);
  const { productCode, name } = parseHeadline(h1);
  const specs = extractSpecTable(html);
  const article = extractArticleFromSpecs(specs, html);
  const imageUrl = pickHeroImage(html);
  // Strip the article row from specs (already at top level)
  const cleanSpecs = specs.filter((s) => !/артикул/i.test(s.key));
  return { url, article, productCode, name, specs: cleanSpecs, imageUrl };
}

// ─── images ───────────────────────────────────────────────────────────────

function imageExt(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp)(?:$|\?)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

function safeArticleFilename(article) {
  return article.replace(/[^A-Za-z0-9\-_.]/g, '_');
}

async function downloadImage(url, article) {
  const ext = imageExt(url);
  const filename = `${safeArticleFilename(article)}.${ext}`;
  const out = resolve(OUT_IMAGES, filename);
  if (existsSync(out)) return filename;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buf);
  return filename;
}

// ─── main ─────────────────────────────────────────────────────────────────

async function pool(items, worker, concurrency = CONCURRENCY) {
  const queue = items.slice();
  const results = new Array(items.length);
  let idx = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await worker(queue[i], i);
      } catch (e) {
        results[i] = { error: e.message };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const sofievka = JSON.parse(readFileSync(SOFIEVKA, 'utf8'));
  const knownArticles = new Set(sofievka.products.map((p) => p.article));
  console.log(`Sofievka articles: ${knownArticles.size}`);

  console.log('Crawling catalog…');
  const productUrls = await crawl();
  console.log(`Found ${productUrls.length} product URLs.`);

  const urlsToFetch = Number.isFinite(LIMIT) ? productUrls.slice(0, LIMIT) : productUrls;
  console.log(`Fetching ${urlsToFetch.length} product pages…`);

  const parsed = await pool(urlsToFetch, async (url, i) => {
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${urlsToFetch.length}`);
    return parseProduct(url);
  });

  const byArticle = new Map();
  let matched = 0;
  let withoutArticle = 0;
  let notInSofievka = 0;
  for (const p of parsed) {
    if (!p || p.error) continue;
    if (!p.article) {
      withoutArticle++;
      continue;
    }
    if (!knownArticles.has(p.article)) {
      notInSofievka++;
      continue;
    }
    byArticle.set(p.article, p);
    matched++;
  }
  console.log(
    `Matched ${matched} | no article ${withoutArticle} | not in Sofievka ${notInSofievka}`
  );

  // Images
  if (!SKIP_IMAGES) {
    console.log('Downloading images…');
    let imgOk = 0;
    let imgFail = 0;
    const entries = [...byArticle.values()];
    await pool(
      entries,
      async (p, i) => {
        if (!p.imageUrl) return;
        if ((i + 1) % 20 === 0) console.log(`  img ${i + 1}/${entries.length}`);
        try {
          const filename = await downloadImage(p.imageUrl, p.article);
          p.imageFile = `products/${filename}`;
          imgOk++;
        } catch (e) {
          console.warn(`  img fail ${p.article}: ${e.message}`);
          imgFail++;
        }
      },
      CONCURRENCY
    );
    console.log(`Images: ${imgOk} ok, ${imgFail} failed`);
  }

  // Coverage report
  const missing = [];
  for (const a of knownArticles) {
    if (!byArticle.has(a)) missing.push(a);
  }
  console.log(`Coverage: ${matched}/${knownArticles.size} (${((matched / knownArticles.size) * 100).toFixed(1)}%) — ${missing.length} articles still missing`);

  const out = {
    scrapedAt: new Date().toISOString(),
    source: ORIGIN,
    matched,
    missing,
    productsByArticle: Object.fromEntries(byArticle),
  };
  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
