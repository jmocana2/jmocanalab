import type { Lab } from '../types';

/**
 * Calcula el número de orden de un experimento dentro de su categoría.
 * El más antiguo es el 1: publicar uno nuevo no renumera los anteriores.
 * @param lab Experimento que se quiere numerar.
 * @param labs Todos los experimentos de la colección, en cualquier orden.
 * @returns La posición del experimento dentro de su categoría, empezando en 1.
 */
export function labNumber(lab: Lab, labs: Lab[]): number {
  const sameCategory = labs
    .filter((item) => item.data.category === lab.data.category)
    .toSorted((a, b) => a.data.date.getTime() - b.data.date.getTime());

  return sameCategory.findIndex((item) => item.id === lab.id) + 1;
}
