/*
 * Índice de los tokens que se catalogan en Storybook.
 * Solo los NOMBRES: los valores se leen siempre del CSS real.
 */

/** Colores agrupados por rol, en el orden en que se documentan. */
export const COLOR_GROUPS = [
  { title: 'Superficies', tokens: ['--color-bg', '--color-bg-raised', '--color-bg-code'] },
  {
    title: 'Tinta',
    tokens: ['--color-ink', '--color-ink-code', '--color-ink-2', '--color-ink-3', '--color-ink-4'],
  },
  { title: 'Líneas', tokens: ['--color-line', '--color-line-strong'] },
  { title: 'Interacción', tokens: ['--color-link-hover', '--color-accent'] },
] as const;

/** Categorías que redefinen `--color-accent` al heredarse. */
export const CATEGORIES = ['css', 'js', 'react'] as const;

/** Escala tipográfica: token, su interlineado emparejado y para qué sirve. */
export const TYPE_SCALE = [
  { token: '--text-ui', leading: '--leading-ui', usage: 'UI en mayúsculas: nav y etiquetas' },
  { token: '--text-mono-s', leading: '--leading-mono-s', usage: 'Nombre de fichero, notas' },
  { token: '--text-mono', leading: '--leading-mono', usage: 'Numeración y bloque de código' },
  { token: '--text-s', leading: '--leading-s', usage: 'Resumen en el listado' },
  { token: '--text-num', leading: '--leading-ui', usage: 'Número de la ficha' },
  { token: '--text-m', leading: '--leading-m', usage: 'Resumen de la ficha, cuerpo' },
  { token: '--text-brand', leading: '--leading-ui', usage: 'Marca en la cabecera' },
  { token: '--text-l', leading: '--leading-l', usage: 'Título de fila' },
  { token: '--text-xl', leading: '--leading-xl', usage: 'Título de la ficha (fluido)' },
] as const;

/** Tracking, tan estructural en este diseño como el tamaño. */
export const TRACKING = [
  '--track-ui',
  '--track-mono',
  '--track-brand',
  '--track-l',
  '--track-xl',
] as const;

/** Pasos de la escala de espaciado, del 1 al 13. */
export const SPACE_STEPS = Array.from({ length: 13 }, (_, index) => `--space-${index + 1}`);

/** Tokens de layout que no son ni color, ni texto, ni espacio. */
export const LAYOUT_TOKENS = [
  '--grid-row',
  '--width-title',
  '--width-text',
  '--border-thin',
  '--border-active',
  '--bp-tablet',
  '--bp-desktop',
] as const;
