# manualAUTO

Веб-додаток для генерації PDF-інструкцій до технічних виробів (роздільники гідравлічні, насосні групи тощо). Дизайн інструкцій єдиний, наповнення — різне.

## Стек

- **React 18 + TypeScript + Vite** — фронтенд
- **TailwindCSS** — стилі
- **pdfjs-dist** — парсинг старих PDF-інструкцій у формі браузера (без бекенду)
- **lucide-react** — іконки

Без бекенду. Розгортається як статичний сайт (Vercel/Netlify).

## Старт локально

```bash
npm install
npm run dev
```

Відкриється на `http://localhost:5173`.

## Команди

| Команда | Що робить |
|---|---|
| `npm run dev` | Локальний дев-сервер з hot reload |
| `npm run build` | Білд для продакшну (у папку `dist/`) |
| `npm run preview` | Превʼю продакшн-білду локально |
| `npm run lint` | Перевірка типів TypeScript |

## Структура

```
src/
├── App.tsx                       # головний компонент
├── main.tsx                      # точка входу React
├── index.css                     # глобальні стилі + Tailwind
├── styles/pdf-print.css          # стилі для @media print і preview
├── data/initialData.ts           # дефолтні значення
├── types/instruction.ts          # TypeScript-типи блоків
├── blocks/
│   ├── cover/                    # Титульна сторінка
│   ├── techSpecs/                # Технічні характеристики
│   └── sections/                 # Пронумеровані розділи
├── parsers/
│   ├── pdfExtract.ts             # витяг тексту з PDF (pdfjs-dist)
│   └── parsePdf.ts               # головна функція parsePdfToData
└── components/
    ├── ui/                       # Input, Textarea, IconBtn, FieldGroup
    └── ImportReport.tsx          # модалка звіту парсингу
```

Кожен блок — окрема папка з трьох файлів:
- `*Editor.tsx` — форма редагування (ліва панель)
- `*Preview.tsx` — рендер сторінки PDF (права панель)
- `*Parser.ts` — витяг даних з існуючого PDF

## Поточний стан (v0.3)

Готові 3 з 7 блоків:
- Cover (титульна)
- TechSpecs (технічні характеристики)
- Sections (текстові розділи)

В планах: Installation, Construction, Dimensions, Warranty.
