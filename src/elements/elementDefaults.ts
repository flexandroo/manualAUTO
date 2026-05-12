import type { PageElement, PageElementType } from '../types/instruction';
import { newId } from '../utils/id';

export function createElement(type: PageElementType): PageElement {
  switch (type) {
    case 'heading':
      return { id: newId('h'), type, text: 'Заголовок розділу' };
    case 'subsection':
      return {
        id: newId('s'),
        type,
        number: '1.1',
        heading: 'Назва підрозділу',
        body: 'Текст підрозділу.',
      };
    case 'paragraph':
      return { id: newId('p'), type, text: 'Текст абзацу.' };
    case 'bulletList':
      return { id: newId('bl'), type, items: ['Перший пункт', 'Другий пункт'] };
    case 'numberedList':
      return {
        id: newId('nl'),
        type,
        items: [
          { number: '2.1', text: 'Перший крок.' },
          { number: '2.2', text: 'Другий крок.' },
        ],
      };
    case 'table':
      return {
        id: newId('t'),
        type,
        headers: ['Параметр', 'Значення'],
        rows: [
          ['Параметр 1', 'Значення 1'],
          ['Параметр 2', 'Значення 2'],
        ],
      };
    case 'kvList':
      return {
        id: newId('kv'),
        type,
        title: 'Характеристики',
        rows: [
          { key: 'Матеріал', value: 'чорна вуглецева сталь' },
          { key: 'Покриття', value: 'порошкове' },
        ],
      };
    case 'scheme':
      return {
        id: newId('sch'),
        type,
        items: [
          { number: 1, label: 'Підключення котла' },
          { number: 2, label: 'Підключення опалення' },
        ],
        flowLines: [],
      };
    case 'image':
      return { id: newId('img'), type, caption: '', align: 'center', size: 'md' };
    case 'imageGrid':
      return {
        id: newId('ig'),
        type,
        columns: 3,
        items: [
          { id: newId('f'), caption: 'рис. 1' },
          { id: newId('f'), caption: 'рис. 2' },
          { id: newId('f'), caption: 'рис. 3' },
        ],
      };
    case 'stepList':
      return {
        id: newId('sl'),
        type,
        imagePosition: 'right',
        steps: [
          { id: newId('step'), number: '1', text: 'Перший крок.' },
          { id: newId('step'), number: '2', text: 'Другий крок.' },
          { id: newId('step'), number: '3', text: 'Третій крок.' },
        ],
      };
    case 'cardGrid':
      return {
        id: newId('cg'),
        type,
        columns: 3,
        cards: [
          { id: newId('card'), title: 'Назва 1', body: 'Короткий опис.', bullets: ['Особливість 1', 'Особливість 2'] },
          { id: newId('card'), title: 'Назва 2', body: 'Короткий опис.', bullets: ['Особливість 1', 'Особливість 2'] },
          { id: newId('card'), title: 'Назва 3', body: 'Короткий опис.', bullets: ['Особливість 1', 'Особливість 2'] },
        ],
      };
    case 'warning':
      return { id: newId('w'), type, level: 'warning', title: 'Увага!', body: '' };
    case 'twoColumn':
      return { id: newId('tc'), type, left: [], right: [] };
    case 'separator':
      return { id: newId('sep'), type };
  }
}
