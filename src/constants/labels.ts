import type { Category } from '../types';

/** Nombre visible de cada categoría. El orden de las claves es el orden de la nav. */
export const CATEGORY_LABEL = {
  css: 'CSS',
  js: 'JS',
  react: 'React',
} as const satisfies Record<Category, string>;
