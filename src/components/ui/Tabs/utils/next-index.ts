type Move = (current: number, total: number) => number;

/**
 * Teclas que mueven el foco entre pestañas y a qué posición llevan. Las flechas dan la
 * vuelta al llegar a un extremo; Inicio y Fin saltan a la primera y a la última.
 */
const MOVES = new Map<string, Move>([
  ['ArrowRight', (current, total) => (current + 1) % total],
  ['ArrowLeft', (current, total) => (current - 1 + total) % total],
  ['Home', () => 0],
  ['End', (_current, total) => total - 1],
]);

/**
 * Calcula a qué pestaña lleva una tecla.
 * @param key Valor de `KeyboardEvent.key`.
 * @param current Posición de la pestaña con el foco.
 * @param total Número de pestañas de la lista.
 * @returns La posición de destino, o `undefined` si la tecla no mueve el foco.
 */
export function nextIndex(key: string, current: number, total: number): number | undefined {
  return MOVES.get(key)?.(current, total);
}
