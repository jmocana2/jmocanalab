# jmocanalab — Fase 2 en detalle: esqueleto, tokens y Storybook

> Fecha: 2026-09-11 · Estado: **listo para ejecutar**.
> Desarrolla la Fase 2 de [03-plan-implementacion.md](03-plan-implementacion.md).
> Los valores de esta fase salen de `.design/Main.dc.html`, que pasa de maqueta
> a **fuente de verdad de los tokens**.

---

## 0. Decisiones que se cierran aquí

1. **Los tokens son los valores de la maqueta.** Sin reinterpretar. Lo que se hace
   es *nombrarlos* y *ordenarlos en escalas*, no cambiarlos. (§2)
2. **El acento se queda**, en los tres neones, uso mínimo: categoría activa y número
   de ficha. Era el pendiente de `02-diseno.md` §5.
3. **Storybook entra en la Fase 2**, con `@storybook/html-vite`. (§4)
4. **`CLAUDE.md` y las skills se escriben antes de tocar código**, no después. (§5)
5. **Los tokens se escriben en `rem`**, con `html { font-size: 62.5% }` como raíz.
   Consecuencia de la skill `maquetacion`; afecta a todas las escalas de §2.
6. **Los nombres de tokens y clases van en inglés**; los comentarios, en español. De ahí
   que §2 use `--color-bg`, `--space-7` y `data-category`.

### Sobre Storybook — una objeción y cómo la resuelvo

Storybook **no tiene framework oficial para Astro** (sobre Vite soporta React, Vue 3,
Web Components, HTML, Svelte, SvelteKit, Qwik y Solid; Astro no está en la lista). No va
a renderizar tus `.astro` sin trabajo extra, y ese trabajo extra choca con la prioridad
del proyecto: baja fricción por experimento.

Pero el caso de uso que describes —*almacenar el DS, servir de referencia*— **no
necesita renderizar `.astro`**. Necesita renderizar **CSS sobre markup**, y para eso
`@storybook/html-vite` es exacto: una story es una función que devuelve un string de
HTML. Los componentes de este sitio (fila numerada, nav de categorías, pestañas,
eyebrow) son precisamente eso: HTML + clases + tokens.

**Regla que lo mantiene barato**: la clase CSS vive en `src/styles/`, y tanto el
componente `.astro` como la story consumen **la misma hoja**. Storybook nunca tiene su
propia copia de los estilos. Si un día molesta, se borra `.storybook/` y el sitio no se
entera.

---

## 1. Tareas, en orden

| # | Tarea | Bloquea a |
|---|---|---|
| **2.0** | **`CLAUDE.md` + skills del proyecto (§5)** | **todo** |
| 2.1 | `git init` · `.gitignore` ✅ | todo |
| 2.2 | Scaffold Astro + TS strict + Prettier + ESLint | todo |
| 2.3 | `src/styles/` — **tokens y capas** (§2) | 2.5, 2.6, 2.8 |
| 2.4 | `src/content.config.ts` — esquema Zod | 2.7 |
| 2.5 | Layout base: cabecera, nav de categorías, footer | 2.7 |
| 2.6 | Clases de componente: `.fila`, `.eyebrow`, `.num`, `.mono` | 2.7, 2.8 |
| 2.7 | Lab de prueba `css/prueba` de punta a punta | 2.9 |
| 2.8 | Storybook con las stories del DS (§4) | — |
| 2.9 | GitHub + Vercel | — |

2.8 puede hacerse en paralelo a 2.7 o después; **no bloquea el deploy**.

---

## 2. Tokens — `src/styles/`

Cuatro ficheros, importados en ese orden desde `src/styles/global.css`:

```
src/styles/
├── global.css      # @layer + imports, nada más
├── tokens.css      # custom properties. Único sitio con valores literales
├── reset.css       # reset mínimo
└── base.css        # elementos: body, a, headings, focus visible
```

```css
/* global.css */
@layer reset, tokens, base, componentes, utilidades;
```

`@layer` desde el primer fichero: añadirlo después obliga a revisar toda la cascada.

### 2.1 Color

Los valores de la maqueta, con nombre semántico:

```css
@layer tokens {
  :root {
    /* superficies */
    --color-bg:        #F2F1ED;  /* blanco roto cálido */
    --color-bg-raised:   #FBFAF7;  /* panel elevado */
    --color-bg-code: #EAE8E1;  /* bloque de código */

    /* tinta */
    --color-ink:        #141311;  /* texto principal, iconos, línea fuerte */
    --color-ink-code: #3A382F;  /* texto dentro del bloque de código */
    --color-ink-2:      #55524B;  /* resúmenes, texto secundario */
    --color-ink-3:      #8A867C;  /* metadatos, numeración */
    --color-ink-4:      #A8A49A;  /* placeholders, notas de demo */

    /* líneas */
    --color-line:        #DCDAD3;  /* separador fino de filas */
    --color-line-strong: var(--color-ink); /* línea bajo la cabecera */

    /* interacción */
    --color-link-hover: #00A5C4;

    /* acento: por defecto, no hay */
    --color-accent:       var(--color-ink);
  }

  [data-category="css"]   { --color-accent: #E14B9B; }
  [data-category="js"]    { --color-accent: #D98E00; }
  [data-category="react"] { --color-accent: #00A5C4; }
}
```

Tres detalles que vienen de la maqueta y hay que respetar:

- `a:hover` usa **#00A5C4** (el cian de React) como color de interacción genérico, no el
  acento de la categoría. Por eso es un token aparte.
- `--color-accent` **hereda**: basta poner `data-category` en el `<body>` de la ficha o
  en la fila del listado, y todo lo de dentro se tiñe solo.
- Su valor por defecto es la tinta. Si mañana se decide ir a blanco y negro estricto, se
  borran las tres reglas `[data-category]` y ya está. Ese es todo el coste de revertir
  la decisión.

**Modo oscuro**: se preparan los nombres, **no se implementa**. El día que toque es un
bloque `[data-theme="oscuro"]` redefiniendo estas mismas propiedades.

### 2.2 Tipografía

```css
--font-ui:   Archivo, "Helvetica Neue", Arial, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
```

Ambas por `@fontsource` (`archivo` 400/500/600 y `jetbrains-mono` 400/500), **no por
`fonts.googleapis.com`**: la maqueta enlaza a Google Fonts porque es un prototipo; en
producción eso es una petición a un tercero y un salto de layout gratis.

La maqueta usa nueve tamaños (11, 12, 13, 14, 15, 16, 17, 23, 42). Son muchos para un
sitio que presume de no tener tamaños intermedios, pero **cada uno tiene un rol
identificable**, así que la escala se define por rol, no por número:

Se escriben en `rem` sobre una raíz de `62.5%`, así que el valor en rem es el de px
dividido entre 10 (11px → `1.1rem`). La columna `px` queda como referencia de la maqueta.

| Token | px | rem | line-height | Dónde |
|---|---|---|---|---|
| `--text-ui` | 11 | 1.1 | 1 | `.eyebrow`: nav, etiquetas, todo en mayúsculas |
| `--text-mono-s` | 12 | 1.2 | 1.4 | nombre de fichero, `[ demo · iframe aislado ]` |
| `--text-mono` | 13 | 1.3 | 1.85 | numeración de fila y cuerpo del bloque de código |
| `--text-s` | 14 | 1.4 | 1.6 | resumen en el listado |
| `--text-num` | 15 | 1.5 | 1 | el número de la ficha, en color de acento |
| `--text-m` | 16 | 1.6 | 1.62 | resumen de la ficha |
| `--text-brand` | 17 | 1.7 | 1 | `jmocanalab` en la cabecera |
| `--text-l` | 23 | 2.3 | 1.25 | título de fila en el listado |
| `--text-xl` | 42 | 4.2 | 1.12 | título de la ficha |

Y el tracking, que en este diseño es tan estructural como el tamaño:

```css
--track-ui:    0.18em;   /* mayúsculas de 11px */
--track-mono:  0.08em;   /* nombre de fichero */
--track-brand: -0.01em;  /* 17px */
--track-l:     -0.015em; /* 23px */
--track-xl:    -0.025em; /* 42px */
```

Pesos: 400 cuerpo · 500 titulares y mono destacada · 600 UI en mayúsculas y marca.

**`--text-xl` es el único que se hace fluido** (`clamp(2.8rem, 5vw, 4.2rem)`). El resto son
fijos: entre 11 y 16px, escalar con el viewport solo estropea la legibilidad.

### 2.3 Espaciado

Aquí toca ser honesto: el espaciado de la maqueta **no es una escala**, son valores
orgánicos (5, 6, 9, 10, 12, 16, 18, 20, 22, 24, 26, 28, 30, 34, 38, 40, 46, 62, 64, 88).
Tokenizarlos tal cual son veinte tokens que no significan nada.

Propuesta: **snap a una escala de 13 pasos** que los absorbe todos con desviación máxima
de 2px —imperceptible en este diseño— y a cambio el espaciado pasa a ser un sistema:

```css
--space-1: 0.4rem;  --space-2: 0.6rem;  --space-3: 0.8rem;  --space-4: 1.2rem;   /*  4  6  8 12 */
--space-5: 1.6rem;  --space-6: 2rem;    --space-7: 2.4rem;  --space-8: 2.8rem;   /* 16 20 24 28 */
--space-9: 3.4rem;  --space-10: 4rem;   --space-11: 4.8rem; --space-12: 6.4rem;  /* 34 40 48 64 */
--space-13: 8.8rem;                                                  /* 88 */
```

Correspondencias que importan (el resto cae solo):

- Padding de página: `--space-11 --space-13 --space-12` → `48px 88px 64px` (maqueta: 46/88/64).
- Separación entre bloques mayores: `--space-12` (62 → 64).
- Padding vertical de fila: `--space-7` (24, exacto).
- Gap de la rejilla de fila: `--space-8` (28, exacto).
- Gap del nav de categorías: `--space-9` (34, exacto).

**Si algún snap chirría al verlo montado, gana la maqueta**: se ajusta el valor del
token, no se añade un token nuevo.

### 2.4 Layout

```css
--grid-row: 6.6rem minmax(0, 1fr) 13.2rem 9.6rem; /* num · título · meta · estado */
--width-title: 78rem;   /* max-width del título de ficha */
--width-text:   62rem;   /* max-width de los resúmenes */
--border-thin:    1px;     /* excepción: son líneas, no texto */
--border-active:  2px;     /* subrayado de categoría activa y de pestaña */
```

En móvil `--grid-row` colapsa a una columna y el número pasa a ir sobre el título.
Es el único punto de ruptura real del diseño.

---

## 3. Lo demás de la Fase 2

### 3.1 Esquema de contenido (tarea 2.4)

El de §3.5 del análisis, sin cambios. Un matiz que conviene fijar ya: **`entry` y
`sources` son rutas relativas a la raíz del proyecto**, y el generador de la Fase 3 las
rellena solo. Si se dejan libres, a la quinta ficha hay cinco convenciones.

### 3.2 Lab de prueba (tarea 2.7)

`src/content/labs/css/prueba.mdx` con `runtime: iframe` y
`public/labs/css/prueba/index.html` con un grid de tres cajas. Su única función es
demostrar que la cadena entera funciona: frontmatter → ruta → iframe → deploy.
**Se borra en la Fase 4**, cuando entre el primer experimento real.

### 3.3 Deploy (tarea 2.9)

Repo público en GitHub, Vercel conectado con preview por PR, `output: 'static'` y sin
adaptador. `site: 'https://jmocanalab.vercel.app'` en `astro.config.mjs` es el **único**
sitio donde aparece el host; todo lo demás, rutas relativas.

`gh` no está instalado en esta máquina (anexo del análisis): el repo se crea desde la web.

---

## 4. Storybook — tarea 2.8

### Instalación

```
pnpm add -D storybook @storybook/html-vite
```

`.storybook/main.ts` apunta a `../src/**/*.stories.ts`, y `.storybook/preview.ts` hace
**un solo import**: `../src/styles/global.css`. Ese import es todo el acoplamiento que
existe entre Storybook y el sitio.

### Qué se documenta, y en qué orden

1. **Tokens** — tres stories generadas por bucle sobre las custom properties: paleta,
   escala tipográfica, escala de espaciado. Es lo que pides: el DS almacenado y visible.
   Se escriben leyendo `getComputedStyle(document.documentElement)`, así que **no hay una
   segunda lista de valores que mantener**: si cambia `tokens.css`, cambia Storybook.
2. **Componentes**, uno por clase, según se vayan creando: `eyebrow`, `num`, `fila` (con
   variantes por categoría vía el atributo `data-category`), nav de categorías,
   pestañas, bloque de código.

### La regla que evita que esto se pudra

> Ninguna story define estilos. Una story es markup + clases. Si una story necesita CSS
> que no está en `src/styles/`, es que falta una clase en el sitio.

### Lo que Storybook **no** va a hacer aquí

No renderiza `.astro` ni el `CodeViewer` con Shiki (que se resuelve en build). Esos se
ven en el sitio, no en Storybook. Intentar meterlos es exactamente el trabajo extra que
no compensa.

### Alternativa, por si molesta

Una página `/ds` dentro del propio sitio hace el 80% de esto con cero dependencias, y sí
puede renderizar componentes `.astro` reales. Queda anotada: si en dos meses Storybook se
ha quedado sin actualizar, ese es el camino de salida.

---

## 5. Tarea 2.0 — `CLAUDE.md` y skills, antes de nada

El análisis (§5.4) recomendaba *primero el scaffold, luego las skills*, con un argumento
bueno: **una skill escrita antes de que existan convenciones documenta convenciones
inventadas**. Pero a día de hoy las convenciones ya no hay que inventarlas: están en
`01-decisiones.md`, `02-diseno.md` y en §2 de este documento.

Así que el orden se corrige, y se parte en dos:

- **Lo que ya está decidido se escribe ahora** (`CLAUDE.md` y dos skills). Si no, el
  scaffold se hace improvisando y luego la skill documenta lo improvisado.
- **Lo que depende de código que aún no existe se escribe en la Fase 3** (la skill
  `nuevo-lab` no puede documentar un generador que no está escrito).

### 5.1 `CLAUDE.md` — versión inicial ✅ (2026-09-11)

Corto a propósito. Es un documento vivo; hoy solo tiene que impedir que el scaffold vaya
en contra de lo decidido. Seis bloques:

1. **Qué es esto.** Una frase: laboratorio y portfolio front-end de jmocanalab, Astro
   estático, repo público.
2. **La línea roja** (decisión 10), literal y en primer lugar:
   > Ningún código, captura, dato, marca o asset de Atresmedia ni de Knowmad mood entra
   > en este repositorio. Las técnicas aprendidas se reimplementan desde cero con un
   > ejemplo genérico.
3. **Idioma** (decidido el 2026-09-11): **en inglés lo que lee la máquina, en español lo
   que lee una persona.** Ficheros, carpetas, clases BEM, tokens, variables y slugs, en
   inglés; comentarios, JSDoc, texto de interfaz, `docs/` y commits, en español. Sin i18n.
4. **Reglas de estilos**, las que hacen falta para no romper §2:
   - CSS moderno: custom properties, `@layer`, nesting nativo. **Sin Tailwind, sin SASS.**
   - **Ni un hex fuera de `src/styles/tokens.css`.** Todo lo demás consume `var(--…)`.
   - Sin tamaños ni espaciados literales en componentes: salen de la escala.
   - Nada de `!important`, nada de estilos en línea salvo valores calculados.
5. **Cómo se añade un experimento**: hoy, a mano según §3.2; desde la Fase 3, con
   `pnpm new:lab` y nunca a mano. Se actualiza esa línea cuando exista el generador.
6. **Git**: los commits los hace el usuario. Nunca `commit`, `push`, `merge`, `rebase` ni
   `reset`; el trabajo se deja en el árbol sin preparar y se propone el mensaje. Es una
   regla permanente, así que va en `CLAUDE.md` y **no** en una skill: una skill solo se
   carga cuando la tarea encaja, y esta prohibición tiene que estar siempre activa.
7. **Principio de diseño**, que es el que más se va a incumplir si no está escrito:
   > **Ante la duda, quitar.** Aire, mayúsculas pequeñas con tracking, monocromo con un
   > acento mínimo. Si una propuesta añade un elemento decorativo, la respuesta por
   > defecto es no.

Más `pnpm` como gestor, Node 22, y enlaces a los cuatro documentos de `docs/`.

Lo que **no** va en el `CLAUDE.md` de hoy: la lista de componentes, las rutas definitivas
ni el detalle de los tokens. Eso vive en `docs/` y en el código; duplicarlo garantiza que
se desincronice.

### 5.2 Skills escritas ✅ (2026-09-11)

Dos, no tres. `revisar-demo` se descarta: su contenido cabe en los checklists finales de
las otras dos, y una skill que solo es una lista de repaso se queda sin actualizar.

**`.claude/skills/maquetacion/SKILL.md`** — HTML y CSS. Se dispara al tocar plantillas,
componentes, demos de `public/labs/` u hojas de estilo.

- **Idioma**: la tabla de qué va en inglés y qué en español, con el matiz de que `alt`,
  `aria-label` y `title` son texto visible para un lector de pantalla y van en español.
- **HTML**: semántico (el listado es un `ol`, no `div`), **accesibilidad AA como
  requisito de salida** —contraste 4.5:1, foco visible, `aria-label` en los enlaces de
  icono, `title` en los `iframe`, `aria-current` en la navegación, nada de información
  solo por color—, y **BEM** en español, con el elemento sin anidar.
- **Core Web Vitals**: CLS (dimensiones reservadas en imágenes e `iframe`, fuentes
  autoalojadas con `swap` y fallback ajustado), LCP (`preload` de **una** variante de
  fuente, `fetchpriority`), y la regla de que no se optimiza a ciegas.
- **CSS**: todo en `rem`, mobile first con `min-width` y solo 768/1200, anidado limitado
  a 3 niveles de herencia y reservado a estados y media queries, y comentarios **solo**
  en la cabecera del fichero.

**`.claude/skills/javascript/SKILL.md`** — JS y TS. Se dispara al tocar cualquier `.ts`,
`.js`, `.tsx`, script o demo de JS.

- **Idioma**: identificadores en inglés, comentarios y JSDoc en español; constantes cuyo
  valor es texto de interfaz, nombre en inglés y valor en español.
- **Sin barrels**: cada import apunta al fichero real.
- **Estructura por responsabilidad**: `containers` (lógica), `UI` (presentación),
  `utils`, `constants`, `types.ts`. Lo específico vive en el componente; sube a
  `src/` cuando lo usa un segundo.
- **JSDoc solo en funciones y en variables de configuración**, sin repetir los tipos.
- **Sin ternarios anidados y sin `switch`**: objeto de consulta con
  `satisfies Record<…>`, que además obliga a cubrir todos los casos en compilación.
- Extras del proyecto: sin `any`, sin `as` salvo `as const`, exportaciones nombradas, y
  el recordatorio de que el presupuesto de JS del cliente es parte del diseño.

Delimitación con el agente que ya tienes: **`especialista-layouts-web` hace el trabajo
pesado de maquetación; la skill aporta las convenciones de este proyecto.** No se
duplica: la skill no explica cómo funciona Grid.

### 5.3 Skills que esperan a la Fase 3

**`nuevo-lab`** — depende de `scripts/new-lab.mjs`. Escribirla antes es documentar una
interfaz imaginaria. Va junto con la tarea 3.1.

### 5.4 Cómo evolucionan

`CLAUDE.md` y las skills se revisan **al cerrar cada fase**, no continuamente. Dos
señales de que hay que tocar algo: una corrección que ya has dado dos veces, o una
convención que se estableció en el código y no está escrita en ningún sitio.

---

## 6. Definición de "Fase 2 terminada"

- [ ] `https://jmocanalab.vercel.app` carga la home con cabecera y nav de categorías.
- [ ] `/labs/css/prueba` renderiza su iframe aislado.
- [ ] Ni un solo hex fuera de `tokens.css`. Ni un px fuera de las excepciones de la
      skill `maquetacion`.
- [ ] `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan en limpio.
- [ ] `pnpm storybook` muestra las tres stories de tokens leyendo del CSS real.
- [ ] `.env*` ignorado desde el primer commit.
- [ ] `CLAUDE.md` escrito **antes** del scaffold, y las skills `maqueta` y
      `javascript` en `.claude/skills/`.

Lo que **no** entra en esta fase, y no pasa nada: modo oscuro, View Transitions,
`new:lab`, `CodeViewer`, CI, contenido real.
