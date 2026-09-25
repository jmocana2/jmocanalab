import type { Status } from '../../../../types';

/** Nombre visible de cada estado editorial, tal como aparece en la maqueta. */
export const STATUS_LABEL = {
  idea: 'Idea',
  wip: 'En curso',
  done: 'Listo',
} as const satisfies Record<Status, string>;
