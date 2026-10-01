import type { Lab } from '../types';

/**
 * Obtiene el slug de un experimento a partir de su id de colección.
 * @param lab Experimento; su id es la ruta del fichero sin extensión («css/prueba»).
 * @returns El último tramo del id: «prueba».
 */
export function labSlug(lab: Lab): string {
  return lab.id.replace(`${lab.data.category}/`, '');
}

/**
 * Construye la URL pública de la ficha de un experimento.
 * @param lab Experimento.
 * @returns La ruta de la ficha: «/labs/css/prueba».
 */
export function labPath(lab: Lab): string {
  return `/labs/${lab.data.category}/${labSlug(lab)}`;
}

/**
 * Construye la URL de la demo aislada de un experimento con `runtime: iframe`.
 * Apunta al `index.html` y no a la carpeta: `astro dev` no resuelve el índice de una
 * carpeta de `public/` y daría 404. Las rutas relativas de la demo siguen resolviendo
 * dentro de su carpeta.
 * @param lab Experimento.
 * @returns La ruta del fichero en `public/demos/`: «/demos/css/prueba/index.html».
 */
export function demoPath(lab: Lab): string {
  return `/demos/${lab.data.category}/${labSlug(lab)}/index.html`;
}
