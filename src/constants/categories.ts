/**
 * Categorías de experimentos. La leen el esquema de contenido y el generador `new:lab`.
 * Fijan las URL (`/labs/<categoría>/…`): añadir una es ampliar esta lista; renombrarla
 * rompe enlaces, así que no se renombra.
 */
export const CATEGORIES = ['css', 'js', 'react'] as const;
