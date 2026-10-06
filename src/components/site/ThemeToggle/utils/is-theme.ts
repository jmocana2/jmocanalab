import { THEMES } from '../../../../constants/theme';
import type { Theme } from '../../../../types';

/**
 * Comprueba si un valor leído del DOM es uno de los temas del sitio.
 * @param value Valor de `data-theme`, que puede faltar o traer cualquier cosa.
 * @returns `true` si es un tema conocido; así se estrecha el tipo sin `as`.
 */
export function isTheme(value: string | undefined): value is Theme {
  return THEMES.some((theme) => theme === value);
}
