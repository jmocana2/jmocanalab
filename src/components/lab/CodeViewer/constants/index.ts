import type { CodeLanguage, CodeTheme } from '../types';

/**
 * Lenguaje de Shiki según la extensión del fichero. Lo que no esté aquí se pinta como
 * texto plano; se amplía cuando entre el primer fichero de otro tipo.
 */
export const LANGUAGE_BY_EXTENSION = new Map<string, CodeLanguage>([
  ['html', 'html'],
  ['css', 'css'],
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['astro', 'astro'],
]);

/**
 * Tema monocromo: los colores son tokens, no hex. Todo el código en `--color-ink-code` y
 * los comentarios en `--color-ink-2`; `--color-ink-3` no llega a AA sobre el fondo de
 * código (4.15:1).
 */
export const CODE_THEME = {
  name: 'jmocanalab-mono',
  type: 'light',
  colors: {
    'editor.background': 'var(--color-bg-code)',
    'editor.foreground': 'var(--color-ink-code)',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--color-ink-2)' },
    },
  ],
} satisfies CodeTheme;

/** Id de los dos grupos de pestañas. Hay un visor por ficha, así que son únicos en la página. */
export const VIEWER_ID = {
  view: 'code-viewer',
  files: 'code-viewer-files',
} as const;

/** Texto visible de las pestañas del visor. */
export const VIEWER_LABEL = {
  tablist: 'Resultado y código',
  result: 'Resultado',
  code: 'Código',
  files: 'Ficheros',
} as const;
