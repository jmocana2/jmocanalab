<h1 align="center">jmocanalab</h1>

<p align="center">
  jmocanalab — laboratorio y portfolio front-end. Experimentos de CSS, JS y React, cada uno con su código y su demo aislada.
</p>

<p align="center">
  <img alt="release v0.0.1" src="https://img.shields.io/badge/release-v0.0.1-555555?style=flat-square">
  <img alt="Astro 7.3" src="https://img.shields.io/badge/Astro-7.3-BC52EE?style=flat-square">
  <img alt="Node 22+" src="https://img.shields.io/badge/Node-22%2B-3C873A?style=flat-square">
  <img alt="pnpm 10" src="https://img.shields.io/badge/pnpm-10-F69220?style=flat-square">
</p>

---

## Qué es

Un sitio estático donde reimplemento desde cero técnicas de front-end y las dejo
documentadas: **resultado + código fuente**, sin demos embebidas de terceros.

Sirve a dos cosas a la vez: es el sitio donde experimento y es lo que puedo enseñar a un
cliente.

## Estado

**Fase 2 — esqueleto.** El sitio todavía no tiene contenido. Hecho hasta ahora: la
dirección visual, el sistema de tokens, el catálogo en Storybook y el andamiaje del
proyecto. El plan por fases está en [`docs/03-plan-implementacion.md`](docs/03-plan-implementacion.md).

## Stack

Astro 7 con `output: 'static'` · TypeScript en `strict` · CSS moderno con tokens
(custom properties, `@layer`, nesting nativo) · Storybook para el design system ·
pnpm · desplegado en Vercel.

Sin Tailwind, sin SASS, sin i18n y con el JavaScript de cliente reducido al mínimo.

## Cómo se organiza un experimento

Cada uno declara su **nivel de aislamiento** en el frontmatter, que es la decisión
arquitectónica que hace esto sostenible:

| `runtime` | Cómo se renderiza                                 | Para qué                          |
| --------- | ------------------------------------------------- | --------------------------------- |
| `inline`  | Componente `.astro` con estilos con scope         | Demos que conviven bien           |
| `iframe`  | HTML suelto en `public/demos/…`, en un `<iframe>` | CSS y JS puros. Aislamiento total |
| `island`  | Componente con `client:visible`                   | Demos que necesitan un framework  |

## Puesta en marcha

```bash
pnpm install
pnpm dev          # servidor de desarrollo, abre el navegador solo
pnpm storybook    # catálogo del design system, en el 6006
```

| Script                                    | Qué hace                 |
| ----------------------------------------- | ------------------------ |
| `pnpm dev`                                | Servidor de desarrollo   |
| `pnpm build`                              | Build estático a `dist/` |
| `pnpm preview`                            | Sirve el build           |
| `pnpm typecheck`                          | `astro check`            |
| `pnpm lint` · `pnpm lint:fix`             | ESLint                   |
| `pnpm format` · `pnpm format:check`       | Prettier                 |
| `pnpm storybook` · `pnpm storybook:build` | Design system            |

## Estructura

```
.claude/skills/     convenciones del proyecto (maquetacion · javascript)
.design/            maqueta de la dirección visual
docs/               análisis, decisiones y plan por fases
src/styles/         tokens y capas. Único sitio con valores literales
src/design-system/  catálogo de Storybook
```

## Documentación

| Documento                                                          | Qué contiene                                |
| ------------------------------------------------------------------ | ------------------------------------------- |
| [`docs/00-analisis-inicial.md`](docs/00-analisis-inicial.md)       | Análisis técnico y alternativas descartadas |
| [`docs/01-decisiones.md`](docs/01-decisiones.md)                   | Decisiones cerradas                         |
| [`docs/02-diseno.md`](docs/02-diseno.md)                           | Dirección visual                            |
| [`docs/03-plan-implementacion.md`](docs/03-plan-implementacion.md) | Plan por fases                              |
| [`docs/04-fase-2-detalle.md`](docs/04-fase-2-detalle.md)           | Fase 2 en detalle                           |

---

<p align="center">
  <a href="https://www.linkedin.com/in/jmocanalab">LinkedIn</a> ·
  <a href="https://github.com/jmocana2">GitHub</a>
</p>
