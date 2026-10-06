# Arquitectura

Laboratorio y portfolio front-end. Sitio **estático** en Astro, desplegado en Vercel.
No hay servidor, ni API, ni secretos: todo se resuelve en el build y al navegador llega
HTML, CSS y el mínimo de JS.

---

## 1. Stack

| Área      | Elección                                                                       |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Astro 7, `output: 'static'`, sin adaptador                                     |
| Lenguaje  | TypeScript `strict` (TS 6, fijado hasta que `typescript-eslint` soporte TS 7)  |
| Estilos   | CSS moderno: custom properties, `@layer`, nesting nativo. Sin Tailwind ni SASS |
| Código    | Shiki (el que trae Astro), resaltado en el build                               |
| Fuentes   | `@fontsource` (Archivo y JetBrains Mono), autoalojadas                         |
| Calidad   | ESLint 10 (flat) + `jsx-a11y` · Prettier 3 · `astro check`                     |
| DS        | Storybook (`@storybook/html-vite`), solo para los tokens                       |
| Entorno   | pnpm 10 · Node 22 (`.nvmrc`)                                                   |
| Deploy    | Vercel, con preview por rama. El host solo aparece en `astro.config.mjs`       |
| CI        | GitHub Actions: lint, typecheck, format:check y build                          |

Solo español, sin i18n.

## 2. Estructura

```
.claude/skills/       convenciones: maquetacion · javascript · nuevo-lab
.design/              maqueta de la dirección visual
.github/workflows/    CI
.storybook/           config de Storybook; importa src/styles/global.css y nada más
docs/                 esta documentación
scripts/new-lab/      el generador de experimentos
public/demos/         demos iframe: HTML suelto, sin build
src/
├── content.config.ts esquema Zod de la colección `labs`
├── content/labs/     las fichas: <categoría>/<slug>.md
├── demos/            demos inline: <categoría>/<Name>/
├── pages/            index · labs/[category]/index · labs/[category]/[slug]
├── layouts/          BaseLayout
├── components/
│   ├── site/         SiteHeader, SiteFooter, SkipLink, ThemeToggle
│   ├── lab/          LabList, LabRow, LabDetail, LabMeta, LabDemo, LabFrame, CodeViewer
│   └── ui/           Tabs (+ TabPanel)
├── constants/        categorías, etiquetas, tema
├── utils/            funciones puras comunes (número, rutas)
├── styles/           tokens y capas. Único sitio con valores literales
├── design-system/    stories de Storybook
└── types.ts
```

## 3. Modelo de contenido

Una colección, `labs`, cargada con `glob` desde `src/content/labs/`. El esquema
(`src/content.config.ts`) es el contrato con las páginas; los tipos salen de él
(`CollectionEntry<'labs'>`), no se reescriben.

- Las **categorías** (`css`, `js`, `react`) están en `src/constants/categories.ts`, que
  leen el esquema y el generador. Fijan las URL: se amplían, no se renombran.
- El **número** de cada ficha (`001`…) se calcula en el build por fecha dentro de su
  categoría (`src/utils/lab-number.ts`).
- Las demos van en `public/demos/` y no en `public/labs/`: chocarían con la ruta de la
  ficha `/labs/<cat>/<slug>`.

El detalle de campos y del generador está en [newlab.md](newlab.md).

## 4. Rutas

| Ruta                             | Página                               | Qué hace                                            |
| -------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `/`                              | `pages/index.astro`                  | Destacados (`featured`), por fecha descendente      |
| `/labs/<cat>`                    | `pages/labs/[category]/index.astro`  | Listado. Se genera para las tres, aunque esté vacía |
| `/labs/<cat>/<slug>`             | `pages/labs/[category]/[slug].astro` | La ficha. La página solo resuelve ruta y número     |
| `/demos/<cat>/<slug>/index.html` | `public/`                            | La demo aislada que carga el `iframe`               |

## 5. Niveles de aislamiento de las demos

La decisión que hace sostenible el sitio: cada demo declara su `runtime` y eso decide cómo
se pinta (`lab/LabDemo/containers/resolve-demo.ts`, un objeto de consulta con
`satisfies Record<Runtime, …>`).

| `runtime` | Cómo                                                   | Estado         |
| --------- | ------------------------------------------------------ | -------------- |
| `iframe`  | `LabFrame` carga el `index.html` de `public/demos/`    | Por defecto    |
| `inline`  | Se busca el `.astro` de `entry` con `import.meta.glob` | Disponible     |
| `island`  | Componente de framework con `client:visible`           | Rompe el build |

El `iframe` aísla por completo estilos y JS: ninguna demo puede ensuciar el sitio ni otra
demo. Es el caso por defecto en CSS y JS.

## 6. Piezas clave

- **`CodeViewer`**: lee del disco los ficheros de `sources` en el build
  (`containers/read-sources.ts`; `import.meta.glob` no puede leer `public/`) y los resalta
  con Shiki y un tema monocromo hecho de tokens. Si una ruta no existe, el build falla.
- **`ui/Tabs` + `TabPanel`**: pestañas con el patrón ARIA completo. El estado inicial sale
  resuelto en el HTML; el script solo cambia de pestaña. Se usa dos veces:
  _Resultado / Código_ y una pestaña por fichero.
- **`ThemeToggle`**: botón de modo oscuro. El tema inicial lo pone un script en línea en el
  `<head>` de `BaseLayout` antes de pintar; el botón lo cambia y lo guarda en
  `localStorage`. Los colores oscuros son los mismos tokens bajo `[data-theme='dark']`.
- **View Transitions nativas** (`@view-transition` en `layout.css`), sin
  `<ClientRouter />`: cero JS y navegaciones reales. La cabecera tiene nombre propio y no
  funde. Con movimiento reducido, nada.

## 7. CSS

- Capas: `@layer reset, tokens, base, components, utilities`, declaradas en
  `src/styles/global.css`, que es el único punto de entrada.
- **Ni un hex, tamaño ni espaciado literal fuera de `tokens.css`.** Todo en `rem` sobre
  `62.5%`.
- Un componente = una carpeta con su `.astro` y su `.css`, el CSS importado en el
  frontmatter. BEM en inglés; el CSS importado es global, así que BEM es lo que evita las
  colisiones.
- Utilidades tipográficas (`.eyebrow`, `.mono`, `.num`, `.visually-hidden`): solo fijan
  tipografía, nunca color ni espaciado.

Las convenciones completas están en la skill `maquetacion`.

## 8. JavaScript de cliente

El presupuesto de JS es parte del diseño. Hoy llega al navegador:

- El script de `ui/Tabs` (unos 660 bytes).
- El de `ThemeToggle` y el script en línea del tema en el `<head>`.

Lo que se pueda resolver en el build o con CSS no llega al navegador. Las convenciones de
TS están en la skill `javascript`.

## 9. Errores de build

Lo que se resuelve en el build y puede faltar **rompe el build** con la ficha y la ruta en
el mensaje: un fichero de `sources`, la demo de un `iframe`, el `.astro` de un `inline`, o
un `island`. Nunca se cae en silencio a un valor por defecto.

## 10. Calidad y despliegue

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
```

Es lo mismo que comprueba el CI (`.github/workflows/ci.yml`) en cada push a `main` y en
cada PR. **El CI avisa, pero no bloquea el despliegue**: Vercel publica aunque falle el
lint o los tipos; solo lo frena un build roto.

## 11. Decisiones cerradas

Para no reabrirlas sin motivo:

1. Sitio estático, sin IA ni endpoints: sin API key no hay factura que proteger.
2. Sin demos embebidas de terceros (StackBlitz, CodeSandbox): código estático y resultado.
3. Storybook solo documenta tokens. Si hace falta un catálogo de componentes, se monta una
   página `/ds` en el sitio.
4. Componentes organizados por rol (`site`, `lab`, `ui`), no por escala.
5. `demoPath` apunta a `.../index.html`, no a la carpeta: `astro dev` no resuelve el índice
   de una carpeta de `public/`.
6. `z` se importa de `astro/zod` (Zod 4). Las URL, con `z.url()`.
7. Pestañas siempre con `ui/Tabs`; sin JS se ve el resultado, no el código.
8. Sin `loading="lazy"` en el `iframe` de la ficha: es el contenido principal y está sobre
   el pliegue.
9. Los commits los hace el usuario (`CLAUDE.md` §3).
