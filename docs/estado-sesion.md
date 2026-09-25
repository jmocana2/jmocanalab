# Estado de sesión — 2026-09-25

Punto en el que dejamos la Fase 2 para retomar en la siguiente sesión.

## Hecho

- 2.0 – 2.5 cerradas. El layout base (`BaseLayout`, `SiteHeader`, `SiteFooter`,
  `layout.css`) está en el commit `22d19aa`.
- 2.8 adelantada en parte: las tres stories de tokens existen en `src/design-system/`.

### Esta sesión (2026-09-25)

- **Anidado BEM resuelto** y escrito en la skill `maquetacion` (§CSS › Anidado):
  bloque → elemento → estado o modificador, máximo tres niveles. Nombres BEM completos:
  el anidado nativo no concatena, así que `&__x` y `&--x` no valen; el modificador se
  escribe `&.bloque__elemento--mod`. Todo componente dentro de `@layer components`.
- `SiteHeader.css` y `SiteFooter.css` refactorizados con esa regla. Además, ahora van
  en `@layer components` (antes estaban sin capa y ganaban a todas las capas) y los
  comentarios sueltos se han subido a la cabecera.
- `04-fase-2-detalle.md` actualizado: Storybook solo documenta tokens, nombres de
  capa en inglés y BEM en inglés.
- `docs/05-layout-base.md` descartado y borrado.

## Decisiones cerradas (para no reabrirlas)

1. **Storybook solo documenta tokens.** Si hace falta un catálogo de componentes, se
   monta una página `/ds` en el sitio.
2. **Organización por rol:** `src/layouts/`, `src/components/{site,lab,ui}/`,
   `src/demos/`.
3. **Un componente = una carpeta** con `.astro` + `.css`, y el CSS importado en el
   frontmatter.
4. **GitHub:** `https://github.com/jmocana2`, confirmado.
5. **Rojo del corazón:** `#e14b4b`, validado.
6. **Anidado BEM:** ver arriba.

## Pendiente

- Añadir `superRefine` a `content.config.ts` (exigir `coverAlt` si hay `cover`) cuando
  aparezca la primera ficha con portada.
- Siguientes tareas del plan:
  - **2.6 · En curso.** Hecho: `src/styles/utilities.css` (`.eyebrow`, `.mono`,
    `.num`, `.visually-hidden`), ya aplicado en la cabecera y el pie. Falta `LabRow`
    (la antigua `.fila`), que está bloqueado por el contraste AA (ver abajo).
  - 2.7 · Lab de prueba `css/prueba` de punta a punta.
  - 2.8 · Storybook: solo quedan revisar las stories de tokens.
  - 2.9 · GitHub + Vercel.

### ⛔ Contraste AA de la paleta (bloquea `LabRow`)

Ratios sobre `--color-bg` (#f2f1ed). Para texto pequeño hace falta 4.5:1; para líneas
y otros indicadores de interfaz, 3:1.

| Token / uso                           | Ratio | Texto pequeño | Línea (3:1) |
| ------------------------------------- | ----- | ------------- | ----------- |
| `--color-ink-2`                       | 6.89  | ✅            | ✅          |
| `--color-ink-3` (numeración, estado)  | 3.21  | ❌            | ✅          |
| `--color-ink-4`                       | 2.20  | ❌            | ❌          |
| acento CSS `#e14b9b`                  | 3.27  | ❌            | ✅          |
| acento JS `#d98e00`                   | 2.38  | ❌            | ❌          |
| acento React / hover `#00a5c4`        | 2.59  | ❌            | ❌          |

### Otros pendientes de accesibilidad

- Falta el enlace para saltar al contenido en `BaseLayout`.

### Preguntas abiertas rescatadas del antiguo `05`

No bloquean 2.6, pero conviene cerrarlas antes de acabar la fase:

- **Móvil:** ancho máximo de página por encima de 1200 y rejilla de `LabRow` en
  móvil. Lo de `LabRow` se decide en 2.6.
- **Hover = acento de React:** `--color-link-hover` y el acento de React son el mismo
  `#00a5c4`, así que en las páginas de React no se distinguen.
- **Modo oscuro:** el atributo será `[data-theme="dark"]`, en inglés, no `data-tema`.
- **`<head>`:** patrón del `<title>`, favicon, `theme-color` y qué fuente se precarga.
- **Traducción de `status`, `category` y `runtime`:** en
  `src/constants/labels.ts`, con `satisfies Record<…>`.
