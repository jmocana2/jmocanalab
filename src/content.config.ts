import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Colección de experimentos del laboratorio.
 *
 * `entry` y `sources` son rutas relativas a la raíz del proyecto; desde la Fase 3
 * las rellena `pnpm new:lab` y no se escriben a mano.
 *
 * La numeración visible («001») no es un campo: se calcula al construir, por orden
 * de fecha dentro de cada categoría.
 */
const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(180),
    // Añadir una categoría es tocar este enum; renombrarla rompe URLs.
    category: z.enum(['css', 'js', 'react']),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(['idea', 'wip', 'done']).default('wip'),
    featured: z.boolean().default(false),
    runtime: z.enum(['inline', 'iframe', 'island']),
    entry: z.string().optional(),
    sources: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.url().optional(),
        article: z.url().optional(),
      })
      .default({}),
  }),
});

export const collections = { labs };
