# Diseño

Dirección visual de jmocanalab. **Manda en lo visual**: no se reinterpreta al maquetar.
Los valores viven en `src/styles/tokens.css`; aquí está el porqué.

Maqueta: `.design/Main.dc.html` (fuente) y `.design/jmocanalab-direccion-visual.html` (el
lienzo publicado, en https://claude.ai/code/artifact/1b71bc34-f2c8-4627-8016-84bca9fb4c83).

---

## 1. Principio

> **Ante la duda, quitar.**

Aire por encima de todo, mayúsculas pequeñas con mucho tracking, monocromo con un acento
mínimo. Si una propuesta añade un elemento decorativo, la respuesta por defecto es **no**.

La referencia es una landing editorial (Maxim Nilov): blanco roto casi vacío, texto negro
en mayúsculas pequeñas y un único acento. Se toman sus principios, no sus gestos
decorativos.

Se retiró por el camino, y no vuelve: la ilustración del científico, la inicial gigante
con la fuente display Syne, el contador de experimentos en la nav y los enlaces sociales en
texto (ahora son iconos).

## 2. Las tres vistas

Una sola pantalla con tres estados. Cada uno tiene su URL; la sensación de "un bloque que
cambia" la dan las View Transitions. **Si hay que elegir entre el efecto y la URL, gana la
URL.**

| Vista      | Ruta                       | Qué muestra                                          |
| ---------- | -------------------------- | ---------------------------------------------------- |
| Destacados | `/`                        | Los labs con `featured: true`, por fecha             |
| Listado    | `/labs/<categoría>`        | Todos los de una categoría, por número; estado vacío |
| Ficha      | `/labs/<categoría>/<slug>` | Número, título, metadatos y _Resultado / Código_     |

- La cabecera y la nav no se mueven nunca: llevan `view-transition-name` y no funden.
- **Numeración** `001`, `002`… en las tres vistas: es el hilo conductor. Se calcula en el
  build por fecha dentro de la categoría; no es un campo del frontmatter.
- El listado es una **lista editorial numerada**, no una rejilla de tarjetas.
- La ficha arranca más cerca de la nav que las listas (46 frente a 62 en la maqueta).

## 3. Color

| Token                | Claro     | Oscuro    | Uso                                   |
| -------------------- | --------- | --------- | ------------------------------------- |
| `--color-bg`         | `#f2f1ed` | `#161512` | Fondo                                 |
| `--color-bg-raised`  | `#fbfaf7` | `#1e1d19` | Marco de la demo                      |
| `--color-bg-code`    | `#eae8e1` | `#211f1b` | Bloque de código                      |
| `--color-ink`        | `#141311` | `#ecebe6` | Texto, iconos, línea fuerte           |
| `--color-ink-code`   | `#3a382f` | `#d2d0c7` | Texto del código                      |
| `--color-ink-2`      | `#55524b` | `#b0ada4` | Resúmenes, comentarios del código     |
| `--color-ink-3`      | `#716e66` | `#8f8b82` | Metadatos, numeración                 |
| `--color-ink-4`      | `#a8a49a` | `#55524b` | Solo decoración: no llega a AA        |
| `--color-line`       | `#dcdad3` | `#33312b` | Separador fino                        |
| `--color-link-hover` | `#00788f` | `#4cbfd6` | Hover y foco. No depende de categoría |
| `--color-heart`      | `#e14b4b` | `#e85d5d` | El corazón del pie                    |

Cuatro colores de la maqueta se oscurecieron para cumplir AA en claro (texto terciario,
hover, acento JS y acento React).

### Acento por categoría

| Categoría | Claro     | Oscuro    |
| --------- | --------- | --------- |
| CSS       | `#e14b9b` | `#e65fa8` |
| JS        | `#bf7d00` | `#d39a1e` |
| React     | `#0098b4` | `#1fb0cc` |

- Se hereda: basta `data-category` en un ancestro. Por defecto, el acento es la tinta.
- **Solo en líneas y marcas, nunca como color de texto**: en claro llegan a 3:1, no a
  4.5:1. La categoría activa, el número de la ficha y la pestaña activa van en tinta con
  un subrayado del acento. La maqueta lo pinta como texto en varios sitios; ahí manda AA.
- Revertir a blanco y negro estricto es borrar las reglas `[data-category]`.

### Modo oscuro

- Botón en la cabecera, separado de LinkedIn y GitHub. Un solo icono (círculo a medio
  rellenar) con `aria-pressed`.
- Sin elección guardada, sigue a `prefers-color-scheme`. La elección se guarda en
  `localStorage` y la aplica un script en línea en el `<head>`, antes de pintar.
- Misma familia cálida que el claro. Ratios sobre el fondo: tinta 15.3, `ink-2` 8.1,
  `ink-3` 5.4, hover 8.5.
- Las demos `iframe` no lo heredan: son documentos aislados con sus propios colores.

## 4. Tipografía

**Archivo** (400 / 500 / 600) para UI y titulares, **JetBrains Mono** (400 / 500) para
código y numeración. Autoalojadas con `@fontsource`, sin Google Fonts. Se precargan los
tres pesos de Archivo, que pintan sobre el pliegue en todas las vistas.

| Token           | rem | Dónde                                          |
| --------------- | --- | ---------------------------------------------- |
| `--text-ui`     | 1.1 | `.eyebrow`: nav, etiquetas, todo en mayúsculas |
| `--text-mono-s` | 1.2 | Nombre de fichero, metadatos de la ficha       |
| `--text-mono`   | 1.3 | Numeración de fila, cuerpo del código          |
| `--text-s`      | 1.4 | Resumen en el listado                          |
| `--text-num`    | 1.5 | Número de la ficha                             |
| `--text-m`      | 1.6 | Cuerpo, resumen de la ficha                    |
| `--text-brand`  | 1.7 | `jmocanalab` en la cabecera                    |
| `--text-l`      | 2.3 | Título de fila                                 |
| `--text-xl`     | 4.2 | Título de la ficha. El único fluido (`clamp`)  |

El tracking es tan estructural como el tamaño: `0.18em` en las mayúsculas de 11px y
negativo en los titulares. Pesos: 400 cuerpo, 500 titulares, 600 UI en mayúsculas y marca.

## 5. Espaciado y layout

- Escala de 13 pasos (`--space-1` 0.4rem … `--space-13` 8.8rem) que absorbe los valores
  orgánicos de la maqueta con un margen de 2px como máximo. Si un valor chirría, se ajusta
  el token; no se añade uno nuevo.
- Todo en `rem` sobre `html { font-size: 62.5% }`. Excepciones: los bordes de 1px y 2px.
- Mobile first, dos breakpoints: **768 y 1200**. Ninguno más.
- **Ancho máximo de página: 1905px** (`--width-page`), centrado. Por encima, los laterales
  quedan en el color de fondo.
- Fila del listado: `--grid-row` (número · título · metadatos · estado). En móvil colapsa a
  una columna con el número sobre el título.
- Título de ficha hasta `--width-title` (78rem); textos hasta `--width-text` (62rem).
- Demo `iframe`: altura fija de `--height-frame` (40rem).

## 6. Código

Monocromo, como la maqueta: tema de Shiki propio cuyos colores son tokens, así que el modo
oscuro se lo lleva gratis. Comentarios en `--color-ink-2`, porque `--color-ink-3` no llega
a AA sobre el fondo de código. Sin números de línea, sin botón de copiar, sin etiqueta de
lenguaje.

## 7. Accesibilidad

AA como requisito de salida, no como repaso final.

- Pestañas con el patrón ARIA completo (`ui/Tabs`): flechas, Inicio, Fin y tabindex móvil.
- `aria-current="page"` en el listado de la categoría y `"true"` en la ficha.
- Iconos con `aria-label` en el enlace o botón y `aria-hidden` en el `<svg>`.
- `prefers-reduced-motion` apaga también las View Transitions.
- Áreas de pulsación de 24×24px como mínimo.

## 8. Marca

- Nombre: **jmocanalab**. LinkedIn `linkedin.com/in/jmocanalab`, GitHub `github.com/jmocana2`.
  El email no se publica.
- Favicon: `jm` en minúsculas, trazo en blanco roto sobre un cuadrado redondeado en tinta.
  `public/favicon.svg`, y `favicon.ico` (16, 32 y 48) generado a partir del SVG.
