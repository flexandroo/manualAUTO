import {
  Heading1,
  ListOrdered,
  AlignLeft,
  List,
  Table2,
  ListTree,
  Cog,
  Image as ImageIcon,
  Images,
  AlertTriangle,
  Minus,
  Hash,
  Columns2,
  type LucideIcon,
} from 'lucide-react';
import type { PageElementType } from '../types/instruction';

interface Spec {
  type: PageElementType;
  label: string;
  hint: string;
  icon: LucideIcon;
}

export const ELEMENT_SPECS: Record<PageElementType, Spec> = {
  heading: {
    type: 'heading',
    label: 'Заголовок розділу',
    hint: 'Помаранчева плашка з назвою',
    icon: Heading1,
  },
  subsection: {
    type: 'subsection',
    label: 'Підрозділ (1.1, 1.2…)',
    hint: 'Номер + заголовок + текст',
    icon: Hash,
  },
  paragraph: {
    type: 'paragraph',
    label: 'Параграф тексту',
    hint: 'Простий абзац без заголовка',
    icon: AlignLeft,
  },
  bulletList: {
    type: 'bulletList',
    label: 'Список з маркерами',
    hint: 'Помаранчеві крапки + текст',
    icon: List,
  },
  numberedList: {
    type: 'numberedList',
    label: 'Нумерований список',
    hint: 'Кроки 2.1, 2.2…',
    icon: ListOrdered,
  },
  table: {
    type: 'table',
    label: 'Таблиця',
    hint: 'Заголовок + рядки',
    icon: Table2,
  },
  kvList: {
    type: 'kvList',
    label: 'Список ключ-значення',
    hint: '"Матеріал: сталь"',
    icon: ListTree,
  },
  scheme: {
    type: 'scheme',
    label: 'Схема + легенда',
    hint: 'Зображення + нумеровані виноски',
    icon: Cog,
  },
  image: {
    type: 'image',
    label: 'Зображення',
    hint: 'Одна картинка з підписом',
    icon: ImageIcon,
  },
  imageGrid: {
    type: 'imageGrid',
    label: 'Сітка зображень',
    hint: '2-4 картинки в ряд',
    icon: Images,
  },
  warning: {
    type: 'warning',
    label: 'Попередження',
    hint: 'Увага / небезпека / інфо',
    icon: AlertTriangle,
  },
  twoColumn: {
    type: 'twoColumn',
    label: 'Дві колонки',
    hint: 'Контейнер з елементами в 2 колонки',
    icon: Columns2,
  },
  separator: {
    type: 'separator',
    label: 'Розділювач',
    hint: 'Тонка лінія',
    icon: Minus,
  },
};

export const ELEMENT_ORDER: PageElementType[] = [
  'heading',
  'subsection',
  'paragraph',
  'bulletList',
  'numberedList',
  'twoColumn',
  'table',
  'kvList',
  'scheme',
  'image',
  'imageGrid',
  'warning',
  'separator',
];
