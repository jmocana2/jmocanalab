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
  - **2.6 · Hecha** (a falta de verla renderizada, que llega con 2.7):
    - `src/styles/utilities.css`: `.eyebrow`, `.mono`, `.num`, `.visually-hidden`.
    - `src/components/lab/LabRow/`: fila numerada. `meta="category"` para
      Destacados y `meta="tags"` para el listado. El enlace va en el título y se
      estira a toda la fila con `::after`. En móvil, el metadato y el estado bajan a
      una segunda línea.
    - `src/types.ts` (`Lab`, `Category`, `Status`, que salen de la colección) y
      `src/constants/labels.ts` (`CATEGORY_LABEL`, que usan la cabecera y `LabRow`).
  - **2.7 · Lab de prueba `css/prueba` de punta a punta.** ← siguiente. Conviene
    marcarlo con `featured: true` y pintarlo en la home con `LabRow`, para ver la
    fila montada.
  - 2.8 · Storybook: solo quedan revisar las stories de tokens.
  - 2.9 · GitHub + Vercel.

### Paleta AA — resuelto (2026-09-25)

Opción «mínimo AA». **Los acentos se usan solo en líneas y marcas, nunca como color de
texto.** Por eso la categoría en Destacados va en tinta, con un subrayado del acento.

| Token                        | Antes   | Ahora   | Ratio sobre el fondo |
| ---------------------------- | ------- | ------- | -------------------- |
| `--color-ink-3`              | #8a867c | #716e66 | 4.51 (texto)         |
| `--color-link-hover` (y foco) | #00a5c4 | #00788f | 4.53 (texto)         |
| acento CSS                   | #e14b9b | igual   | 3.27 (línea)         |
| acento JS                    | #d98e00 | #bf7d00 | 3.02 (línea)         |
| acento React                 | #00a5c4 | #0098b4 | 3.03 (línea)         |

Con esto también queda resuelto el problema de que el hover y el acento de React
fueran el mismo color. `--color-ink-4` (2.20) solo vale para decoración, nunca para
texto. Falta reflejar estos valores en `04-fase-2-detalle.md` §2.1 y en
`02-diseno.md`.

### Otros pendientes

- Accesibilidad: falta el enlace para saltar al contenido en `BaseLayout`.
- Accesibilidad: el `<ol>` del listado lleva `list-style: none` (reset) y Safari le
  quita la semántica de lista. Se soluciona con `role="list"` en el `<ol>` de la
  página.
- `pnpm typecheck` da 22 avisos de que `z` de `astro:content` está obsoleto. Hay que
  importarlo de `astro/zod`.

### Preguntas abiertas rescatadas del antiguo `05`

- **Móvil:** ancho máximo de página por encima de 1200.
- **Modo oscuro:** el atributo será `[data-theme="dark"]`, en inglés, no `data-tema`.
- **`<head>`:** patrón del `<title>`, favicon, `theme-color` y qué fuente se precarga.
