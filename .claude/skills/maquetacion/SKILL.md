---
name: maquetacion
description: Convenciones de maquetación HTML y CSS de jmocanalab — HTML semántico con accesibilidad AA, BEM, Core Web Vitals, CSS en rem, mobile first con dos breakpoints y anidado. Úsala al crear o modificar cualquier plantilla, componente, demo de `public/labs/` u hoja de estilos del proyecto.
---

# Maquetación — HTML y CSS

Convenciones **de este proyecto**. No explican cómo funciona Grid ni qué es BEM: dan por
sabido eso y fijan cómo se hace aquí. Para el trabajo pesado de maquetación existe el
agente `especialista-layouts-web`; esta skill manda sobre él en caso de conflicto.

Principio que gobierna todo lo demás: **ante la duda, quitar.**

---

## Idioma

Regla única, y aplica a todo el proyecto:

| Qué                                                                              | Idioma                        |
| -------------------------------------------------------------------------------- | ----------------------------- |
| Nombres de fichero y de carpeta                                                  | **inglés**                    |
| Identificadores en código: clases BEM, tokens CSS, atributos `data-*`, variables | **inglés**                    |
| Slugs de contenido y de URL                                                      | **inglés**, ASCII, sin tildes |
| Comentarios                                                                      | **español**                   |
| Texto visible en la interfaz                                                     | **español**                   |
| Documentación (`docs/`) y mensajes de commit                                     | **español**                   |

En una palabra: **se escribe en inglés lo que lee la máquina y en español lo que lee una
persona.** El comentario en español es deliberado: es donde se explica el porqué, y ahí
gana la precisión sobre la uniformidad.

Caso frecuente: el `alt`, el `aria-label` y el `title` **son texto visible para quien usa
un lector de pantalla**, así que van en español. El nombre de la clase que los envuelve,
en inglés.

```html
<a class="social__link" aria-label="Perfil de LinkedIn">…</a>
```

---

## Componentes Astro — estructura de fichero

Un componente = **una carpeta con su nombre**, y dentro dos ficheros: el `.astro` con el
marcado y el `.css` con los estilos. Nada de un `.astro` suelto con el CSS mezclado.

```
src/components/site/SiteHeader/
├── SiteHeader.astro
└── SiteHeader.css
```

Reglas:

- El `.css` se carga desde el frontmatter con `import './NombreComponente.css';`. Astro
  lo bundlea y optimiza, y como se importa junto al componente, se envía a la página
  solo cuando el componente se usa.
- **No se usa `<style>` inline dentro del `.astro`** ni la sintaxis `<style src="…">`.
  Marcado y estilos separados: cada uno en su fichero.
- **El CSS importado es global**, no scopeado. Por eso BEM es obligatorio: los nombres
  son únicos por diseño (`site-header__brand`, `site-footer__credit`) y no hay colisiones.
- Si un componente necesita aislamiento real de estilos —caso rarísimo: por ejemplo,
  integrar un tercero sin control de nombres— sí se puede usar `<style>` inline. Es la
  excepción, no la norma.

### Carpetas de componentes

Se organizan **por rol**, no por escala (nada de `atoms/molecules/organisms`). Tres
carpetas con criterio no ambiguo:

```
src/
├── layouts/         # BaseLayout.astro y otros envoltorios de página
├── components/
│   ├── site/        # chrome del sitio: SiteHeader, SiteFooter, NavCategories
│   ├── lab/         # piezas de listado y ficha: LabRow, LabMeta, CodeViewer
│   └── ui/          # primitivas sin dominio: Eyebrow, Num, Tabs
└── demos/           # componentes de demo (runtime inline/island)
```

- `site/` aparece en todas las páginas.
- `lab/` aparece en páginas de labs (listado, categoría, ficha).
- `ui/` no depende del dominio: se puede reutilizar en cualquier sitio.

Si algo no encaja claramente en ninguna, la respuesta por defecto es **no crear una
cuarta carpeta**: probablemente sea un `ui/` o pertenece a un componente existente.

---

## HTML

### Semántica

Cada bloque se marca con el elemento que le corresponde, no con `div` y una clase:
`header`, `nav`, `main`, `article`, `section` (solo con encabezado propio), `footer`,
`ol`/`ul` para listas, `button` para acciones y `a` para navegación —nunca al revés—.

Un solo `h1` por página. La jerarquía de encabezados no salta niveles: el tamaño lo
decide el CSS, no la etiqueta.

El listado de experimentos es una **lista ordenada** (`ol`): está numerado y el orden
significa algo.

### Accesibilidad — nivel AA, sin excepciones

Es requisito de salida, no un repaso final.

- **Contraste**: 4.5:1 en texto normal, 3:1 en texto grande (≥24px o ≥18.66px en negrita)
  y en los bordes de componentes de interfaz.
  ⚠️ Aquí está la trampa de este diseño: mayúsculas de 11px con mucho tracking en gris.
  El texto de UI va en `--color-ink` sobre `--color-bg`. `--color-ink-3` y
  `--color-ink-4` **solo** para metadatos que no son información crítica, y
  comprobando el ratio.
- **Foco visible siempre**: `:focus-visible` con un contorno propio. Jamás
  `outline: none` sin sustituto.
- **Área de pulsación** de 24×24px como mínimo en cualquier cosa clicable.
- **Texto alternativo**: `alt` descriptivo en imágenes informativas, `alt=""` en las
  decorativas, `aria-label` en los enlaces que solo llevan un icono SVG (LinkedIn,
  GitHub) y `aria-hidden="true"` en el `<svg>` de dentro.
- **Estado activo** de la navegación: `aria-current="page"`. El subrayado es refuerzo
  visual, no la única señal.
- **Los `iframe` de las demos llevan `title`** descriptivo. Sin él son un agujero de
  accesibilidad en la vista más importante del sitio.
- **Nada de información solo por color**: la categoría activa se marca también por
  subrayado y `aria-current`.
- Respetar `prefers-reduced-motion` en cualquier animación, incluidas las View
  Transitions.
- El orden del DOM es el orden de lectura. Si el CSS reordena visualmente, revisar que
  la tabulación sigue teniendo sentido.

### BEM

`block__element--modifier`, **en inglés** y en minúsculas.

```html
<article class="card card--featured">
  <p class="card__number">001</p>
  <h2 class="card__title">Holy grail con Grid</h2>
  <p class="card__summary">…</p>
</article>
```

Reglas:

- **El elemento no anida**: `card__title`, nunca `card__header__title`. Si aparece esa
  necesidad, `header` es un bloque propio.
- El modificador **nunca va solo**: siempre acompaña a su bloque o elemento.
- Un bloque no impone márgenes exteriores a su alrededor; el espaciado lo pone el
  contenedor. Así el bloque es reutilizable.
- El acento de categoría no es un modificador BEM, es el atributo `data-category` en un
  ancestro (§CSS). BEM describe la estructura; `data-*` transporta el dato.

### Core Web Vitals

**CLS** — el que más barato es de romper en este sitio:

- Toda imagen lleva `width` y `height`, o `aspect-ratio` en CSS.
- Los `iframe` de las demos llevan altura reservada antes de cargar.
- **Fuentes con `font-display: swap` y su fallback métricamente ajustado**
  (`size-adjust`, `ascent-override`). Archivo y JetBrains Mono se sirven desde
  `@fontsource`, autoalojadas: sin `fonts.googleapis.com`, que es una conexión a un
  tercero en la ruta crítica.
- Nada que se inyecte por JS y empuje el contenido ya pintado.

**LCP**:

- Identificar el elemento LCP de cada vista —normalmente el título— y no hacerlo depender
  de una fuente sin `swap`.
- `<link rel="preload" as="font" crossorigin>` para la **única** variante de fuente que
  interviene en el primer pintado. Precargar de más compite por ancho de banda y empeora
  el LCP: es una decisión medida, no un reflejo.
- `fetchpriority="high"` en la imagen del LCP si alguna vista llega a tener una;
  `loading="lazy"` + `fetchpriority="low"` en todo lo que quede bajo el pliegue.
- Los `iframe` de demo: `loading="lazy"` salvo que sean el contenido principal de la
  ficha y estén sobre el pliegue.

**INP**: el sitio es estático y casi sin JS. Mantenerlo así es la optimización.

Regla general: **no se optimiza a ciegas**. Un `preload` o un `fetchpriority` entran
cuando se ha visto el problema, no por si acaso.

---

## CSS

### Todo en rem

**Ninguna medida en px**, salvo las tres excepciones de abajo. Anchos, altos, paddings,
márgenes, tamaños de fuente, radios: `rem`.

La raíz se define en el HTML para que la conversión sea trivial:

```css
html {
  font-size: 62.5%;
} /* 1rem = 10px con el ajuste por defecto del navegador */
body {
  font-size: 1.6rem;
} /* devuelve el cuerpo a 16px */
```

Se usa `62.5%` y no `10px` **a propósito**: al ser relativo, sigue respetando el tamaño de
fuente que el usuario haya configurado en su navegador —poner `10px` lo rompería, y con
él el criterio AA de redimensionado de texto—. A partir de ahí, 11px → `1.1rem`,
24px → `2.4rem`. Los tokens de `tokens.css` ya están escritos en rem; los componentes solo
consumen `var(--…)`.

Excepciones, y no hay más:

- `1px` en bordes finos (`--border-thin`) y `2px` en el subrayado activo
  (`--border-active`): son líneas, no texto, y escalarlas las emborrona.
- **Las media queries**, que van en px o en rem sabiendo que ahí `rem` se calcula sobre
  el tamaño base del navegador y **no** sobre el `62.5%` del `html` (§Breakpoints).
- `%`, `fr`, `ch`, `vw/vh` donde corresponde por naturaleza: anchos fluidos, rejillas,
  medida de línea.

### Mobile first, dos breakpoints

Se escribe primero el móvil, sin media query, y se **añade** hacia arriba con `min-width`.
Nunca `max-width`.

```css
--bp-tablet: 768px; /* referencia; en la media query va el valor literal */
--bp-desktop: 1200px;
```

```css
.row {
  display: grid;
  gap: var(--space-4);

  @media (min-width: 48em) {
    /* 768px */
    grid-template-columns: var(--grid-row);
    gap: var(--space-8);
  }

  @media (min-width: 75em) {
    /* 1200px */
    /* … */
  }
}
```

Dos breakpoints y ninguno más. Si un componente pide un tercero, casi siempre la solución
correcta es un `minmax()` o un `auto-fit` que no necesita breakpoint.

> Las custom properties **no funcionan dentro de una media query**. Por eso los valores
> van literales ahí; los tokens `--bp-*` existen solo como documentación y para leerlos
> desde JS si hiciera falta.

### Anidado

Se usa el anidado nativo de CSS, con dos límites:

- **Máximo 3 niveles de herencia en el selector final.** Con BEM bien aplicado el máximo
  natural es 2: el bloque y su elemento. Si hace falta un tercero es una señal, no un
  permiso.
- Se anidan **estados y media queries** (`&:hover`, `&:focus-visible`,
  `&[aria-current]`, `@media`), no la estructura. El elemento BEM se escribe como
  selector propio, no anidado dentro del bloque: así se busca por su nombre completo en
  el proyecto.

```css
.card {
  /* … */
}

.card__title {
  font-size: var(--text-l);

  &:hover {
    color: var(--color-link-hover);
  }
}
```

### Capas y tokens

`@layer reset, tokens, base, componentes, utilidades;`. Todo componente va en
`componentes`.

- **Ni un hex, ni un tamaño, ni un espaciado literal fuera de `tokens.css`.** En los
  componentes, solo `var(--…)`.
- Si un valor no existe como token, la pregunta es si el diseño necesita ese valor o si
  hay uno de la escala que sirve. Añadir un token es una decisión; improvisar un valor
  suelto, no.
- Nada de `!important`. Nada de estilos en línea salvo valores calculados en tiempo de
  render.
- El acento de categoría se hereda, no se repite:

```css
[data-category='css'] {
  --color-accent: #e14b9b;
}

.card__number {
  color: var(--color-accent);
}
```

### Comentarios

**Solo al principio del fichero**, resumidos: qué contiene y poco más. Un fichero largo
lleva además un índice de secciones.

```css
/*
 * card.css — vista de un experimento: número, título, resumen y pestañas.
 * Nombre de fichero en inglés, comentario en español.
 *
 * 1. Contenedor
 * 2. Cabecera
 * 3. Pestañas Resultado / Código
 */
```

Dentro del código, nada. Si una regla necesita explicación, o el nombre está mal elegido o
sobra la regla. La excepción razonable es un _hack_ de navegador: ahí el comentario dice
**por qué**, con enlace si lo hay.

---

## Checklist antes de dar algo por bueno

- [ ] Ficheros, carpetas, clases y tokens en inglés; comentarios y texto visible en
      español.
- [ ] Cada componente en su carpeta con `.astro` y `.css` separados; CSS importado
      en el frontmatter, sin `<style>` inline.
- [ ] Marcado semántico, un solo `h1`, jerarquía sin saltos.
- [ ] Contraste AA comprobado, también en el texto de UI pequeño.
- [ ] Foco visible, navegable con teclado, orden de tabulación lógico.
- [ ] `aria-label` en enlaces de icono, `title` en los `iframe`, `aria-current` en la
      navegación.
- [ ] Clases BEM sin anidar elementos y sin modificadores huérfanos.
- [ ] Ni un px fuera de las excepciones. Ni un valor literal fuera de `tokens.css`.
- [ ] Mobile first con `min-width`, solo 768 y 1200.
- [ ] Como mucho 3 niveles de herencia.
- [ ] Comentario de cabecera, nada de comentarios sueltos.
- [ ] Sin saltos de layout al cargar: imágenes e `iframe` con dimensiones reservadas.
- [ ] Funciona a 400px de ancho.
