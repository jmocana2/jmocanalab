/**
 * Formatea el número de orden de una fila con tres dígitos.
 * @param value Posición del experimento, empezando en 1.
 * @returns El número con ceros a la izquierda: 7 → «007».
 */
export function formatNumber(value: number): string {
  return String(value).padStart(3, '0');
}
