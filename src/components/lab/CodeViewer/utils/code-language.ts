import { LANGUAGE_BY_EXTENSION } from '../constants/index';
import type { CodeLanguage } from '../types';

/**
 * Deduce el lenguaje de resaltado a partir de la extensión de un fichero.
 * @param path Ruta del fichero.
 * @returns El lenguaje de Shiki, o `plaintext` si la extensión no está registrada.
 */
export function codeLanguage(path: string): CodeLanguage {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';

  return LANGUAGE_BY_EXTENSION.get(extension) ?? 'plaintext';
}
