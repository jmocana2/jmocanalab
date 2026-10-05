import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Lab } from '../../../../types';
import { demoPath } from '../../../../utils/lab-paths';
import type { Demo, DemoModule } from '../types';

type Runtime = Lab['data']['runtime'];

/** Componentes de las demos `inline`, indexados por su ruta desde la raíz («/src/demos/…»). */
const INLINE_DEMOS = import.meta.glob<DemoModule>('/src/demos/**/*.astro', { eager: true });

/**
 * Comprueba que existe el `index.html` de una demo aislada en `public/demos/`.
 * @param lab Experimento con `runtime: iframe`.
 * @returns La demo con la URL del iframe.
 */
async function resolveIframe(lab: Lab): Promise<Demo> {
  const src = demoPath(lab);

  await access(resolve(process.cwd(), `public${src}`)).catch(() => {
    throw new Error(`La ficha «${lab.id}» es iframe, pero no existe public${src}`);
  });

  return { kind: 'iframe', src };
}

/**
 * Busca el componente de una demo embebida a partir de su `entry`.
 * @param lab Experimento con `runtime: inline`.
 * @returns La demo con el componente que hay que pintar.
 */
async function resolveInline(lab: Lab): Promise<Demo> {
  const module = INLINE_DEMOS[`/${lab.data.entry ?? ''}`];

  if (!module) {
    throw new Error(
      `La ficha «${lab.id}» es inline, pero su entry no apunta a un .astro de src/demos/: ${lab.data.entry ?? '(vacío)'}`,
    );
  }

  return { kind: 'inline', component: module.default };
}

/**
 * Rechaza el nivel `island`: el esquema lo admite, pero no hay integración de React.
 * @param lab Experimento con `runtime: island`.
 * @returns Nunca: siempre lanza.
 */
async function rejectIsland(lab: Lab): Promise<Demo> {
  throw new Error(`La ficha «${lab.id}» es island, y el nivel island aún no está soportado.`);
}

/** Cómo se resuelve la demo de cada runtime. Añadir uno al esquema obliga a añadirlo aquí. */
const RESOLVERS = {
  iframe: resolveIframe,
  inline: resolveInline,
  island: rejectIsland,
} as const satisfies Record<Runtime, (lab: Lab) => Promise<Demo>>;

/**
 * Decide qué se pinta en la pestaña Resultado de una ficha. Se ejecuta en build; si la
 * demo no existe, lanza un error que nombra la ficha.
 * @param lab Experimento.
 * @returns La demo resuelta: la URL de un iframe o el componente de una demo embebida.
 */
export function resolveDemo(lab: Lab): Promise<Demo> {
  return RESOLVERS[lab.data.runtime](lab);
}
