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
 * Lleva barra final para que las rutas relativas de la demo resuelvan dentro de su carpeta.
 * @param lab Experimento.
 * @returns La ruta de la carpeta en `public/demos/`: «/demos/css/prueba/».
 */
export function demoPath(lab: Lab): string {
  return `/demos/${lab.data.category}/${labSlug(lab)}/`;
}
