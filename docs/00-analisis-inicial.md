# jmocanalab — Análisis inicial

> Documento de arranque. Fecha: 2026-09-08 · Estado: **validado**
>
> ⚠️ Las respuestas de la sección 8 están cerradas en **[01-decisiones.md](01-decisiones.md)** (2026-09-09).
> Ese documento manda sobre este donde haya discrepancia. Cambios ya aplicados aquí:
> categorías `css · js · react`, sin IA de inicio, sin i18n, CSS con tokens, repo público.

---

## 1. Resumen del proyecto (lo que he entendido)

**jmocanalab** es un sitio personal con doble función:

1. **Escaparate / portfolio**: intro breve de perfil (Front End Developer en Knowmad mood, cliente Atresmedia) con enlaces a LinkedIn y GitHub, e imagen de cabecera con tono "científico loco".
2. **Laboratorio**: el núcleo real del proyecto. Un espacio con bajo coste de entrada para meter ejercicios, pruebas y demos organizados por categorías tecnológicas (`js`, `css`, `ia`, `react`, …), que sirva para formarse y para enseñar cosas concretas a clientes.

Restricción explícita y muy importante: **no dedicar mucho tiempo al desarrollo del contenedor**. El valor está en el contenido (los experimentos), no en la infraestructura.

Stack propuesto: Astro · monolito modular · GitHub · Vercel · pnpm · Prettier · ESLint.

---

## 2. ¿Qué me parece el proyecto?

**Bien planteado, y Astro es la elección correcta.** Razones concretas:

- Astro es _content-first_: las **content collections** con esquema Zod encajan literalmente con "una ficha por ejercicio, con categoría y tags". Dan tipado, validación e índices automáticos sin escribir un CMS.
- **Islands architecture**: puedes tener demos de React, Vue o Svelte conviviendo en el mismo sitio, cada una hidratada solo en su página. Es el único framework mainstream donde "laboratorio multi-tecnología" no es una pelea.
- **Cero JS por defecto**: un portfolio de front-end con mal Lighthouse resta credibilidad. Astro da un buen punto de partida gratis.
- Curva de entrada baja: si sabes HTML/CSS/JS, escribes `.astro` el primer día.

**El riesgo real del proyecto no es técnico, es de constancia.** La mayoría de "laboratorios personales" mueren porque añadir el ejercicio nº 4 cuesta 40 minutos de fontanería. Todo el diseño que propongo abajo está orientado a que **añadir un experimento cueste menos de 2 minutos**. Si el proyecto acierta en eso, acierta en todo.

### Una observación sobre el objetivo doble

"Formarme" y "enseñar a clientes" tiran en direcciones opuestas: lo primero permite el desorden y el experimento a medias; lo segundo exige pulido. Sugerencia: **un solo sitio, pero un flag `featured: true`** en el frontmatter. La home muestra solo los destacados (cara comercial); las páginas de categoría muestran todo (laboratorio real). Un campo booleano resuelve la tensión sin duplicar sitio.

---

## 3. ¿Me parece bien la arquitectura?

**Sí, con matices.** Monolito modular + GitHub + Vercel + pnpm es proporcionado al tamaño del problema. Tres precisiones:

### 3.1 Monorepo: **no** de entrada

No montes `pnpm workspaces` con `apps/` y `packages/` ahora. Es la trampa clásica: mucha ceremonia para un sitio de una sola app. **Un solo `package.json`** en la raíz. La modularidad la das con estructura de carpetas y content collections, no con workspaces.

_Cuándo reconsiderarlo_: cuando un experimento concreto necesite dependencias incompatibles con el resto (p. ej. una demo que exige React 18 mientras el sitio va con React 19). Entonces, y solo entonces, ese experimento pasa a ser un paquete aislado o, mejor, un embed de StackBlitz. No antes.

### 3.2 Vercel: empieza en **static**, no en SSR

Configura Astro con `output: 'static'` y sin adaptador. Se despliega en Vercel igual de bien (y también en Netlify, Cloudflare o GitHub Pages — no te encierras). Añade `@astrojs/vercel` **solo** el día que aparezca el primer experimento que necesite servidor. Que aparecerá: la categoría `ia`.

### 3.3 El punto que aún no está resuelto: **el aislamiento de las demos**

Esta es, de largo, **la decisión arquitectónica más importante del proyecto** y la que no está cubierta en el planteamiento inicial. Un experimento de CSS típico quiere `* { box-sizing }`, `body { display: grid; height: 100vh }`, `@keyframes` con nombres genéricos… y eso **contamina el sitio entero**. A los 15 experimentos tienes colisiones imposibles de depurar.

Propongo **tres niveles de aislamiento**, y que cada experimento declare el suyo en su frontmatter:

| Nivel | `runtime` | Cómo se renderiza                                                                   | Para qué                                                                                                      |
| ----- | --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **A** | `inline`  | Componente `.astro` embebido en la página, estilos con scope de Astro               | Demos limpias que conviven bien: un componente, una animación contenida                                       |
| **B** | `iframe`  | HTML/CSS/JS suelto en `public/labs/<cat>/<slug>/index.html`, mostrado en `<iframe>` | Demos de CSS/JS puras. **Aislamiento total garantizado**, y el fichero se abre solo en el navegador sin build |
| **C** | `island`  | Componente React/Vue/Svelte con `client:visible`                                    | Demos que necesitan un framework de verdad                                                                    |

El nivel B es el que hace sostenible este laboratorio. Escribir un experimento de CSS pasa a ser "crear una carpeta con un `index.html`" — coste cero, cero riesgo de contaminación, y es _portable_: mañana ese fichero funciona en cualquier otro sitio.

### 3.4 Estructura de carpetas propuesta

```
jmocanalab/
├── docs/                          # este análisis y decisiones futuras
├── public/
│   └── labs/                      # demos aisladas (nivel B), servidas tal cual
│       └── css/
│           └── grid-holy-grail/
│               ├── index.html
│               ├── style.css
│               └── script.js
├── src/
│   ├── components/
│   │   ├── layout/                # Header, Footer, Nav, ThemeToggle
│   │   ├── lab/                   # LabCard, LabGrid, LabFrame, CodeViewer, TagList
│   │   └── profile/               # Hero, SocialLinks
│   ├── content/
│   │   └── labs/                  # 1 fichero .md/.mdx = 1 experimento (la ficha)
│   │       ├── css/grid-holy-grail.mdx
│   │       └── js/debounce-vs-throttle.mdx
│   ├── content.config.ts          # colecciones + esquema Zod
│   ├── demos/                     # componentes de demo niveles A y C
│   │   ├── css/…
│   │   └── react/…
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro            # perfil + destacados
│   │   ├── labs/index.astro       # todas las categorías
│   │   ├── labs/[categoria]/index.astro
│   │   ├── labs/[categoria]/[slug].astro
│   │   └── rss.xml.ts
│   └── styles/                    # tokens, reset, utilidades globales
├── scripts/
│   └── new-lab.mjs                # generador de experimentos ← clave
└── astro.config.mjs
```

### 3.5 El modelo de contenido (esqueleto)

`src/content.config.ts`, usando la API actual de Astro (loader `glob` + Zod):

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(180),
    category: z.enum(['css', 'js', 'react']), // 'ia'/'herramientas' se añaden cuando existan
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(['idea', 'wip', 'done']).default('wip'),
    featured: z.boolean().default(false), // ← cara comercial vs laboratorio
    runtime: z.enum(['inline', 'iframe', 'island']),
    entry: z.string().optional(), // ruta al iframe o al componente
    sources: z.array(z.string()).default([]), // ficheros a mostrar con Shiki
    links: z
      .object({
        repo: z.string().url().optional(),
        article: z.string().url().optional(),
      })
      .default({}),
  }),
});

export const collections = { labs };
```

Con esto, las páginas de categoría, la home, los filtros por tag, el RSS y el sitemap salen todos de `getCollection('labs')`. **Ninguna lista se mantiene a mano.**

> Nota de versiones: Astro va por la **7.3.1** (npm, hoy). Mi conocimiento base es anterior, así que al montar el scaffold conviene contrastar contra la documentación viva (tengo Context7 conectado para eso) antes de dar por buena cualquier API concreta. El esquema de arriba sí lo he verificado contra los docs actuales.

---

## 4. Problemas que detecto

Ordenados por gravedad real, no por orden de aparición.

### 4.1 🔴 Riesgo profesional: contenido de Atresmedia / Knowmad mood

Un portfolio público construido por alguien que trabaja en cliente tiende a acabar incluyendo capturas, snippets o "cosas que resolví en el trabajo". **Eso puede ser código propietario y sujeto a contrato.** No es un riesgo teórico: es la vía más rápida de tener un problema laboral real.

Regla que propongo escribir en el `CLAUDE.md` del proyecto desde el minuto uno: _ningún código, captura, dato, marca o asset de Atresmedia/Knowmad mood entra en este repositorio._ Las técnicas aprendidas se reimplementan desde cero con un caso de ejemplo genérico. Mencionar el puesto en el perfil está perfecto; publicar trabajo del cliente, no.

### 4.2 🔴 La categoría `ia` es la que puede costarte dinero

> **Estado: aplazado.** Se sale sin IA (decisión 9). No hay endpoint ni API key, así que hoy
> este riesgo es cero. Releer esta sección **antes** de escribir la primera demo de IA.

Una demo de IA en un sitio público significa una API key. La key **no puede estar en el cliente** (es visible en el bundle), así que necesita una función serverless. Y una función serverless pública que llama a un LLM sin protección es una factura esperando a ocurrir: basta que alguien la descubra y la ponga en bucle.

Mitigaciones, de menor a mayor esfuerzo:

- **Demo grabada**: la demo muestra prompts y respuestas pre-generadas guardadas como JSON. Cero coste, cero riesgo, y para "enseñar a un cliente" cubre la mayoría de casos. **Es lo que recomiendo para empezar.**
- Si quiere ser interactiva de verdad: rate limit por IP (Vercel KV / Upstash), `max_tokens` bajo, tope de gasto configurado en la consola del proveedor y modelo barato (Haiku).
- Nunca: la key en el frontend, ni un endpoint sin límite.

### 4.3 🟠 Contaminación de estilos entre demos

Ya tratado en 3.3. Sin la estrategia de niveles de aislamiento, este es el problema que a medio plazo hace el sitio inmantenible. Es el motivo por el que el nivel `iframe` no es opcional: es el caso por defecto para `css` y `js`.

### 4.4 🟠 Fricción por experimento = muerte del laboratorio

Si añadir una demo requiere tocar 5 ficheros (crear carpeta, escribir md, registrar en un índice, añadir ruta, importar componente), no lo harás un martes a las 23h. **Mitigación obligatoria**: el script `scripts/new-lab.mjs`, que con `pnpm new:lab` pregunta categoría, título y runtime, y deja creados la ficha `.mdx` y el esqueleto de la demo listos para editar. Es media hora de trabajo que decide si el proyecto vive o muere.

### 4.5 🟠 Conflictos de dependencias entre frameworks

Astro deja instalar `@astrojs/react`, `@astrojs/vue` y `@astrojs/svelte` a la vez, pero cada uno arrastra su árbol y solo puede haber **una versión de React** en el proyecto. Una demo antigua que dependa de una API eliminada te bloquea la actualización del resto.

Mitigación: no coleccionar integraciones "por si acaso". Empieza solo con React (que es lo que ya usas). Añade otra únicamente cuando exista un experimento concreto que la pida. Y para probar algo con una versión incompatible → embed de StackBlitz, no una dependencia más en el `package.json`.

### 4.6 🟡 Crecimiento del build

A 60-80 experimentos con imágenes, el build empieza a notarse. No es un problema hoy y no hay que optimizar por adelantado, pero sí conviene adoptar dos hábitos baratos desde el día 1: usar `<Image>` de Astro (nunca `<img>` con un PNG de 3 MB) y no meter vídeos en el repo.

### 4.7 🟡 Decisiones que son caras de retrasar

Tres cosas que, si se posponen, duelen. Conviene decidirlas ahora aunque sea en 30 segundos:

- **Idioma**: ES, EN o ambos. Si el público objetivo incluye clientes internacionales, el i18n retro-encajado en 40 páginas es un fin de semana perdido. Recomendación pragmática: **todo en español, sin i18n**, y si algún día hace falta se replantea. Pero que sea una decisión consciente.
- **URLs**: `/labs/css/grid-holy-grail` es buena y estable. Cambiarla después rompe enlaces que ya hayas compartido con clientes.
- **Categorías**: el `z.enum` del esquema fija las categorías. Añadir una es trivial; renombrarla implica mover ficheros y romper URLs. Piensa las 4-6 iniciales con calma.

### 4.8 🟡 Detalles menores pero reales

- **Imagen del "científico loco"**: cuidado con los derechos. Genérala tú con IA o usa ilustración con licencia clara (unDraw, Open Peeps). Guarda la procedencia en `docs/`.
- **Datos personales**: no publiques el email en texto plano (scraping/spam). Un `mailto:` ofuscado, o directamente solo LinkedIn.
- **`gh` CLI no está instalado** en esta máquina (comprobado). Para crear el repo remoto o bien lo instalas (`winget install GitHub.cli`), o lo creas a mano desde la web. No es bloqueante.

---

## 5. Mejoras que añadiría

### 5.1 Imprescindibles (el proyecto se resiente sin ellas)

| Mejora                            | Por qué                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Generador `pnpm new:lab`**      | Ya argumentado en 4.4. Es _la_ mejora del proyecto.                                                                                                                    |
| **Visor de código con Shiki**     | Astro ya trae Shiki. Cada demo muestra "resultado + código fuente" en pestañas. Sin esto es una galería, no un laboratorio: el valor pedagógico está en ver el código. |
| **Nivel `iframe` desde el día 1** | Aislamiento (3.3).                                                                                                                                                     |
| **`CLAUDE.md` del proyecto**      | Convenciones, regla de no-contenido-de-cliente, cómo se añade un lab. Hace que las siguientes sesiones conmigo arranquen bien encaminadas.                             |
| **Modo oscuro**                   | Para un portfolio de front-end en 2026 es expectativa base, y cuesta poco si los colores son tokens CSS desde el principio.                                            |

### 5.2 Alto valor / bajo coste

- **View Transitions** de Astro: navegación con transición entre categorías. Tres líneas, efecto muy vistoso en una demo a cliente.
- **Vitest para la categoría `js`**: convierte los ejercicios de JS en katas con tests. Para "formarme" es bastante mejor que un `console.log`, y mostrar tests en verde a un cliente dice mucho.
- **RSS + sitemap** (`@astrojs/rss`, `@astrojs/sitemap`): gratis, y hace el sitio indexable.
- **CI en GitHub Actions**: `lint + typecheck + build` en cada PR. Evita desplegar roto y es en sí mismo un ejemplo enseñable.
- **Imágenes OG automáticas** (`astro-og-canvas` o Satori): cuando compartas un experimento por LinkedIn se ve una tarjeta decente en vez de un enlace pelado. Impacto desproporcionado respecto al esfuerzo.
- **Página `/sobre-mi`** algo más larga que el hero, para cuando un cliente quiere contexto.

### 5.3 Más adelante (no ahora)

- Playwright con un smoke test que recorra **todas** las páginas de lab y falle si alguna revienta. Muy útil a partir de ~20 experimentos: detecta el laboratorio pudriéndose.
- Búsqueda en cliente (Pagefind se integra muy bien con Astro).
- Analítica ligera (Vercel Analytics o Umami) para saber qué demos interesan.
- Lighthouse CI con presupuestos de rendimiento.

### 5.4 Sobre las skills de Claude Code que mencionas

Vas bien encaminado, pero conviene distinguir las piezas:

- **Skills de proyecto** (`.claude/skills/<nombre>/SKILL.md`): instrucciones que se cargan cuando la tarea encaja. Aquí las útiles serían `nuevo-lab` (crear un experimento siguiendo las convenciones), `maqueta` (convenciones HTML/CSS/SASS del proyecto, a11y, responsive) y quizá `revisar-demo` (checklist antes de dar por buena una demo).
- Ya tienes un **agente** `especialista-layouts-web` a nivel de usuario, orientado a HTML/CSS/SASS. Solapa parcialmente con la skill `maqueta`. Sugerencia: la skill lleva las _convenciones de este proyecto_; el agente hace el _trabajo pesado_ de maquetación. No dupliques.
- Recomendación de orden: **primero el scaffold, luego las skills**. Una skill escrita antes de que existan convenciones documenta convenciones inventadas.

### 5.5 Sobre `/design` — sí sirve, pero probablemente no para lo que crees

`/design` **no** genera el proyecto Astro ni escribe componentes en tu repo. Lo que hace es crear un **lienzo de diseño**: varios artboards (pantallas) en un Artifact publicado, con editor visual — puedes seleccionar elementos, cambiar textos y estilos a mano, y exportar a PNG/PDF.

Para lo que quieres encaja bien **en un momento concreto**: antes de escribir código, para decidir el aspecto de las 3 plantillas del sitio (home con hero de científico loco, índice de categoría, ficha de experimento). Es más rápido iterar el diseño ahí que a base de recargar el navegador.

Lo que **no** hace: exportar a Astro. El paso de mockup a componentes lo haríamos después nosotros, mirando el diseño. Aun así merece la pena, porque define la dirección visual antes de maquetar, que es justo donde más tiempo se pierde improvisando.

Recomendación: **usarlo, y pronto** — en la fase 1 del plan, antes de tocar CSS.

---

## 6. Stack concreto recomendado

Versiones comprobadas hoy en npm; se fijarán al instalar.

| Área       | Elección                                                         | Nota                                                    |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| Framework  | **Astro 7.3.x**                                                  | `output: 'static'` de inicio                            |
| Gestor     | **pnpm 10.24** (ya instalado)                                    | fijar con `packageManager` en `package.json`            |
| Runtime    | **Node 22.16** (ya instalado)                                    | fijar con `.nvmrc` + `engines`                          |
| Lenguaje   | **TypeScript**, preset `strict`                                  | tipado gratis en las content collections                |
| Estilos    | **CSS moderno + tokens** (nesting, `@layer`, custom properties)  | SASS solo si lo prefieres por costumbre — ver preguntas |
| UI islands | **React** únicamente al principio                                | añadir otros solo bajo demanda                          |
| Formato    | **Prettier 3.9** + `prettier-plugin-astro`                       |                                                         |
| Lint       | **ESLint 10** (flat config) + `eslint-plugin-astro` + `jsx-a11y` | la a11y importa en un portfolio de front                |
| Hooks      | **simple-git-hooks** + **lint-staged**                           | más ligero que Husky                                    |
| Tests      | **Vitest 5** para katas de JS; Playwright 1.63 más adelante      |                                                         |
| Deploy     | **Vercel** (preview por PR)                                      | adaptador solo cuando haga falta SSR                    |
| CI         | GitHub Actions: lint + typecheck + build                         |                                                         |

Alternativa que merece mención: **Biome** sustituye a Prettier + ESLint con una sola herramienta y es mucho más rápido. No lo recomiendo aquí porque su soporte de `.astro` es más flojo que el de ESLint, pero si en algún momento el tooling molesta, es la salida.

---

## 7. Plan de trabajo propuesto

Pensado para respetar el "no quiero tirarme mucho tiempo".

**Fase 0 — Decisiones (tú, 10 min)**
Responder las preguntas de la sección 8.

**Fase 1 — Dirección visual (~1 h)**
`/design` con 3 artboards: home, índice de categoría, ficha de experimento. Los tokens de color y tipografía salen de aquí.

**Fase 2 — Esqueleto (~2-3 h)**
Scaffold Astro + TS + pnpm + Prettier + ESLint + git. `content.config.ts` con el esquema. Layout base, header/nav, footer, modo oscuro. Deploy a Vercel funcionando **con una sola demo de prueba de punta a punta**, para validar el modelo entero antes de invertir más.

**Fase 3 — Contenido y herramienta (~2 h)**
Hero de perfil real. Páginas de categoría y ficha. `CodeViewer` con Shiki. Script `new-lab`. CI.

**Fase 4 — Primeros experimentos**
2-3 demos reales, una por nivel de aislamiento (A, B, C), que sirven de plantilla viva. A partir de aquí el proyecto es solo contenido.

**Fase 5 — Extras** (RSS, OG images, View Transitions, skills del proyecto), según apetezca.

Realista: **un fin de semana** hasta tener el sitio desplegado con contenido propio.

---

## 8. Información que necesito de ti

> ✅ **Respondido.** Ver [01-decisiones.md](01-decisiones.md). Quedan dos entregables
> pendientes que bloquean la Fase 1: la imagen del científico loco y la captura de la
> referencia estética, ambas en `docs/ref/`.

### Bloqueantes (afectan al scaffold)

1. **Nombre público y datos**: nombre completo tal y como quieres que aparezca, URL de LinkedIn, usuario de GitHub.
2. **Idioma**: ¿solo español? (recomendación: sí, sin i18n).
3. **Categorías iniciales**: confirma las 4-6 definitivas. Propuesta: `js`, `css`, `react`, `ia`, `herramientas`.
4. **Estilos**: ¿CSS moderno con tokens (recomendación) o SASS? ¿Descartamos Tailwind?
5. **Dominio**: ¿el `*.vercel.app` gratuito, o tienes/quieres dominio propio (p. ej. `jmocana.dev`)?

### Importantes (afectan al contenido)

6. **Dos o tres experimentos reales** que ya tengas en mente. Sirven para validar que el esquema de contenido aguanta casos de verdad y no solo el ejemplo bonito.
7. **Perfil**: 3-4 líneas de bio, años de experiencia, tecnologías que quieres destacar.
8. **La imagen del científico loco**: ¿la generas tú, la buscamos, o la montamos como ilustración CSS/SVG?
9. **Categoría `ia`**: ¿demos grabadas (recomendación) o interactivas de verdad? Si interactivas, ¿qué proveedor y qué presupuesto mensual aceptas?
10. **¿Repo público o privado?** Público refuerza el portfolio, pero obliga a más disciplina con el punto 4.1.

### Menores

11. ¿Quieres demos embebidas editables (StackBlitz/CodeSandbox) o basta con código estático + resultado?
12. ¿Tienes preferencia estética? (referencias de sitios que te gusten ayudan mucho en la fase `/design`).

---

## 9. Veredicto en una línea

Proyecto sólido, stack acertado y proporcionado. **Lo que hay que blindar no es la arquitectura, sino la fricción de añadir contenido y el aislamiento entre demos** — y, en el plano no técnico, la línea roja del material de cliente. Si el scaffold sale en un fin de semana y añadir un experimento cuesta dos minutos, el laboratorio vivirá.

---

## Anexo — Entorno verificado en esta máquina

```
Node    v22.16.0
pnpm    10.24.0
git     2.46.2.windows.1
gh      no instalado
Directorio C:\Users\pw-jmocana\www\jmocanalab — vacío, sin repo git
```
