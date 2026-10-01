import type { LabFile, LabInput, Runtime } from '../types.ts';
import { escapeHtml, toPascalCase, yamlString } from './format.ts';

/**
 * Esqueleto de demo para cada runtime. El primer fichero es el `entry` de la ficha.
 * Añadir un runtime al generador es añadir una entrada aquí.
 */
const DEMO_FILES = {
  iframe: iframeDemo,
  inline: inlineDemo,
} as const satisfies Record<Runtime, (input: LabInput) => LabFile[]>;

/**
 * Construye todos los ficheros de un experimento nuevo: la ficha y el esqueleto de su demo.
 * @param input Datos del experimento.
 * @param date Fecha de publicación en formato `AAAA-MM-DD`.
 * @returns Los ficheros que hay que crear, con rutas relativas a la raíz del proyecto.
 */
export function labFiles(input: LabInput, date: string): LabFile[] {
  const demo = DEMO_FILES[input.runtime](input);

  return [
    {
      path: `src/content/labs/${input.category}/${input.slug}.md`,
      content: labEntry(input, date, demo),
    },
    ...demo,
  ];
}

/**
 * Genera la ficha con el frontmatter completo. El resumen queda vacío para rellenarlo a mano;
 * el estado arranca en `wip` y fuera de destacados.
 * @param input Datos del experimento.
 * @param date Fecha de publicación.
 * @param demo Ficheros de la demo: el primero es el `entry` y todos van a `sources`.
 * @returns El contenido del `.md`.
 */
function labEntry(input: LabInput, date: string, demo: LabFile[]): string {
  const paths = demo.map((file) => file.path);

  return [
    '---',
    `title: ${yamlString(input.title)}`,
    "summary: ''",
    `category: ${input.category}`,
    'kind: exercise',
    'tags: []',
    `date: ${date}`,
    'status: wip',
    'featured: false',
    `runtime: ${input.runtime}`,
    `entry: ${paths[0]}`,
    'sources:',
    ...paths.map((path) => `  - ${path}`),
    '---',
    '',
  ].join('\n');
}

/**
 * Esqueleto de una demo aislada en `public/demos/`: un `index.html` que se abre solo en el
 * navegador, sin build ni dependencias.
 * @param input Datos del experimento.
 * @returns El `index.html` de la demo.
 */
function iframeDemo(input: LabInput): LabFile[] {
  return [
    {
      path: `public/demos/${input.category}/${input.slug}/index.html`,
      content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.title)} · demo</title>
    <!--
      Demo aislada: se abre sola con doble clic, sin build ni dependencias.
      No ve los tokens del sitio, así que declara los suyos en :root.
    -->
    <style>
      :root {
        --color-bg: #fbfaf7;
        --color-ink: #141311;
        --text: 1.6rem;
      }

      html {
        font-size: 62.5%;
      }

      body {
        min-height: 100dvh;
        margin: 0;
        background: var(--color-bg);
        color: var(--color-ink);
        font-family: system-ui, sans-serif;
        font-size: var(--text);
      }
    </style>
  </head>
  <body>
    <main class="${input.slug}"></main>
  </body>
</html>
`,
    },
  ];
}

/**
 * Esqueleto de una demo embebida en `src/demos/`: componente Astro con su hoja de estilos,
 * cuyo bloque BEM es el slug para no chocar con el sitio.
 * @param input Datos del experimento.
 * @returns El `.astro` y el `.css` de la demo.
 */
function inlineDemo(input: LabInput): LabFile[] {
  const name = toPascalCase(input.slug);
  const folder = `src/demos/${input.category}/${name}`;

  return [
    {
      path: `${folder}/${name}.astro`,
      content: `---
/*
 * ${name}.astro — demo de «${input.title}», embebida en su ficha (runtime inline).
 */
import './${name}.css';
---

<div class="${input.slug}"></div>
`,
    },
    {
      path: `${folder}/${name}.css`,
      content: `/*
 * ${name}.css — estilos de la demo «${input.title}». Todo cuelga del bloque \`.${input.slug}\`.
 */

@layer components {
  .${input.slug} {
    display: block;
  }
}
`,
    },
  ];
}
