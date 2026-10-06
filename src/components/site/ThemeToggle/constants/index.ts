import type { Theme } from '../../../../types';

/** Tema al que se pasa al pulsar el botón, según el actual. */
export const NEXT_THEME = {
  light: 'dark',
  dark: 'light',
} as const satisfies Record<Theme, Theme>;
