import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import type { Lab } from '../../../../types';
import type { SourceFile } from '../types';
import { codeLanguage } from '../utils/code-language';

/**
 * Lee del disco los ficheros que declara `sources` en la ficha. Se ejecuta en build.
 * Si falta alguno, lanza un error que nombra la ficha y la ruta: mejor un build roto que
 * una pestaña vacía en producción.
 * @param lab Experimento cuyas fuentes se quieren mostrar.
 * @returns Un fichero por ruta, en el orden del frontmatter, con su lenguaje y su contenido.
 */
export async function readSources(lab: Lab): Promise<SourceFile[]> {
  return Promise.all(
    lab.data.sources.map(async (path) => {
      const code = await readFile(resolve(process.cwd(), path), 'utf8').catch(() => {
        throw new Error(
          `La ficha «${lab.id}» declara en sources un fichero que no existe: ${path}`,
        );
      });

      return { path, name: basename(path), lang: codeLanguage(path), code };
    }),
  );
}
