// Colección única `labs`: cada .md/.mdx en src/content/labs/<category>/<slug>
// es una ficha de experimento. El esquema es el contrato con las páginas.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      // Texto visible (español)
      title: z.string().min(1),
      summary: z.string().max(180),

      // Taxonomía: categorías cerradas. Añadir una = tocar este enum.
      // Renombrarlas rompe URLs, así que no se renombran.
      category: z.enum(['css', 'js', 'react']),

      // Naturaleza de la ficha
      kind: z.enum(['exercise', 'demo', 'project']),

      tags: z.array(z.string()).default([]),

      // Fechas
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),

      // Estado editorial
      status: z.enum(['idea', 'wip', 'done']).default('wip'),
      featured: z.boolean().default(false),

      // Renderizado de la demo
      runtime: z.enum(['inline', 'iframe', 'island']),

      // Rutas relativas a la raíz del proyecto.
      // - iframe → 'public/demos/<category>/<slug>/index.html'
      // - inline/island → 'src/demos/<category>/<Componente>.astro'
      entry: z.string().optional(),
      sources: z.array(z.string()).default([]),

      // Imagen de portada opcional, procesada por Astro. Si se declara,
      // el alt es obligatorio (texto visible en español).
      cover: image().optional(),
      coverAlt: z.string().optional(),

      // Enlaces externos opcionales
      links: z
        .object({
          repo: z.string().url().optional(),
          article: z.string().url().optional(),
        })
        .default({}),
    }),
});

export const collections = { labs };
