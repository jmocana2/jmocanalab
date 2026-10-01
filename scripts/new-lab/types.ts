import type { CATEGORIES } from '../../src/constants/categories.ts';
import type { RUNTIMES } from './constants/index.ts';

export type Category = (typeof CATEGORIES)[number];

export type Runtime = (typeof RUNTIMES)[number];

export type LabInput = {
  category: Category;
  title: string;
  slug: string;
  runtime: Runtime;
};

export type Field<T> = {
  flag: string;
  question: string;
  parse: (value: string) => T | undefined;
  hint: string;
};

export type LabFile = {
  path: string;
  content: string;
};
