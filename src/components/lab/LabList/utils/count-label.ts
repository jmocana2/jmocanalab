/**
 * Escribe el contador de un listado, en singular o plural.
 * @param count Número de experimentos de la lista.
 * @returns El texto del contador: «1 ejercicio», «4 ejercicios».
 */
export function countLabel(count: number): string {
  return `${count} ${count === 1 ? 'ejercicio' : 'ejercicios'}`;
}
