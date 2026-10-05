# Estado de sesión — 2026-10-05

**Fase 3 en curso.** Plan detallado y aprobado en `05-fase-3-detalle.md` (2026-10-05).
Hechas 3.1 a 3.5 (la 3.3, solo documental). Siguiente: 3.6, la ficha completa.

## Fase 2 — qué quedó hecho

- 2.0 – 2.9 cerradas. El detalle de cada tarea está en `04-fase-2-detalle.md` y en el
  historial de git.
- Sitio desplegado en `https://jmocanalab.vercel.app`, con preview por rama. El 404 de
  la nav (`/labs/css`, etc.) lo arregla la 3.5 en cuanto se despliegue.
- `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan en limpio. Ni un hex fuera de
  `tokens.css`; el único px fuera de las excepciones es el `1px` de `.visually-hidden`,
  que es el patrón estándar.
- Paleta ajustada a AA y reflejada en `02-diseno.md` §4 y `04` §2.1.

## Decisiones cerradas (para no reabrirlas)

1. **Storybook solo documenta tokens.** Si hace falta un catálogo de componentes, se
   monta una página `/ds` en el sitio.
2. **Organización por rol:** `src/layouts/`, `src/components/{site,lab,ui}/`,
   `src/demos/`.
3. **Un componente = una carpeta** con `.astro` + `.css`, y el CSS importado en el
   frontmatter.
4. **Anidado BEM:** bloque → elemento → estado o modificador, máximo tres niveles,
   nombres completos (`&.bloque__elemento--mod`, nunca `&__x` ni `&--x`). Está en la
   skill `maquetacion`.
5. **Las demos van en `public/demos/`**, no en `public/labs/`: chocaban en el build con
   la ficha `/labs/<cat>/<slug>`.
6. **`demoPath` apunta a `.../index.html`**, no a la carpeta: `astro dev` no resuelve el
   índice de una carpeta de `public/` y el iframe daba 404 en local.
7. **Los acentos solo en líneas y marcas, nunca como color de texto** (3:1, no 4.5:1).
8. **`z` se importa de `astro/zod`** (Zod 4). Las URL, con `z.url()`.
9. **Modo oscuro:** el atributo será `[data-theme="dark"]`.
10. **GitHub:** `https://github.com/jmocana2`. **Rojo del corazón:** `#e14b4b`.

## Pendiente para la Fase 3

- **3.1 · Hecha (2026-10-01).** `scripts/new-lab/`, en TypeScript, ejecutado con
  `node --experimental-strip-types` (sin compilar; con Node ≥ 22.18 el flag sobra).
  - Ficha en **`.md`**: MDX entra el día que una ficha necesite componentes en el texto.
  - Esqueleto para `iframe` e `inline`; `island` se rechaza hasta que exista React.
  - Pregunta lo que falte o lo recibe por argumentos: `--category`, `--title`,
    `--slug` y `--runtime`. Sin terminal no pregunta: falla diciendo qué falta.
  - El **slug se pide aparte**: va en inglés y el título en español.
  - Nunca sobrescribe. Las categorías salen a `src/constants/categories.ts`, que leen el
    esquema y el generador. Nueva dependencia: `@types/node@22`.
  - Skill `nuevo-lab` escrita y `CLAUDE.md` §2 y §6 actualizados.
  - Las demos `inline` usan `.astro` + `.css` con el slug como bloque BEM, no `<style>`
    con scope como decía el análisis: así siguen la skill `maquetacion`.
- **3.2 · Hecha (2026-10-05).** `ui/Tabs` (+ `TabPanel`) y `lab/CodeViewer`, montado en
  la ficha mínima. Tema de Shiki monocromo con tokens; comentarios en `--color-ink-2`.
  Falta la prueba manual de teclado y lector de pantalla en el navegador.
- **3.3 y 3.4 · Hechas (2026-10-05).** La 3.3, solo el plan. En la 3.4 se corrigieron
  las separaciones de página desde 768, que no seguían la maqueta.
- **3.5 · Hecha (2026-10-05).** `/labs/[category]` para las tres categorías, con estado
  vacío. `LabList` recibe ahora `view: 'featured' | 'category'`.
- **`pnpm format:check` falla** por `.claude/settings.local.json`. Resolver antes de la
  3.8 (formatearlo o añadirlo a `.prettierignore`).
- Las decisiones de la Fase 3 (número de ficha en tinta con marca del acento, View
  Transitions nativas, contador del listado, cuerpo del `.md`…) están en
  `05-fase-3-detalle.md` §0.
- Añadir `superRefine` a `content.config.ts` (exigir `coverAlt` si hay `cover`) cuando
  aparezca la primera ficha con portada.

## Preguntas abiertas

- **Móvil:** ancho máximo de página por encima de 1200.
- **`<head>`:** patrón del `<title>`, favicon, `theme-color` y qué fuente se precarga.
