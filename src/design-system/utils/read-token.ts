/*
 * Lectura de los tokens desde el CSS real. Evita mantener una segunda lista de valores:
 * si cambia `tokens.css`, cambian las stories.
 */

/**
 * Lee el valor calculado de una custom property.
 * @param name Nombre del token, con los dos guiones («--color-ink»).
 * @param scope Elemento desde el que se resuelve; por defecto la raíz del documento.
 * @returns El valor ya calculado, sin espacios alrededor.
 */
export function readToken(name: string, scope: Element = document.documentElement): string {
  return getComputedStyle(scope).getPropertyValue(name).trim();
}

/**
 * Convierte un valor en rem a su equivalente en píxeles, según la raíz del documento.
 * @param value Valor con unidad, tal y como está en el token («2.4rem»).
 * @returns Los píxeles resultantes, o `null` si el valor no está en rem.
 */
export function remToPx(value: string): number | null {
  const match = /^([\d.]+)rem$/.exec(value);
  if (match === null) return null;

  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number(match[1]) * rootSize;
}
