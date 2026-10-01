# jmocanalab — Fase 1: dirección visual

> Fecha: 2026-09-10 · Estado: **base aprobada, tokens pendientes**.
> Continúa [01-decisiones.md](01-decisiones.md). Lienzo de diseño:
> https://claude.ai/code/artifact/1b71bc34-f2c8-4627-8016-84bca9fb4c83

---

## 1. Qué se ha aprobado

Una **única pantalla** con tres estados, no tres páginas separadas:

| Estado     | Qué muestra                                       | Cómo se llega                         |
| ---------- | ------------------------------------------------- | ------------------------------------- |
| Destacados | Los labs con `featured: true`, en filas numeradas | Estado inicial · clic en `jmocanalab` |
| Listado    | Todos los ejercicios de una categoría             | Clic en `CSS` · `JS` · `React`        |
| Ficha      | Un ejercicio: resultado + código                  | Clic en una fila del listado          |

Cada estado **sustituye** al anterior en el mismo bloque. La cabecera y la fila
de categorías no se mueven nunca.

## 2. Qué se descartó por el camino

Estaba en la primera propuesta y **se retiró por petición expresa**, en esta orden:

- La **imagen del científico** en la maqueta. Demasiado peso visual para lo que
  se busca. (El asset sigue en `docs/ref/`; queda por decidir si se usa en otro sitio.)
- La **inicial tipográfica gigante** (la "J" de 400px) y, con ella, la fuente
  display Syne. Sobraba.
- El **contador de experimentos** (`008 experimentos`) de la fila de categorías.
- Los enlaces a LinkedIn y GitHub **en texto**: ahora son iconos SVG.

Regla que se deduce de las tres decisiones: **ante la duda, quitar.** La referencia
de Maxim Nilov sigue siendo válida como principio (aire, mayúsculas pequeñas con
tracking, monocromo) pero **sin sus gestos decorativos**.

## 3. Lo que sí se queda

- **La numeración** (`001`, `002`…) en las tres vistas. Es lo que da continuidad
  y sensación de colección ahora que no hay imagen ni tipografía grande.
  Sale del orden por fecha dentro de la categoría, no de un campo manual.
- Fila de categorías bajo una línea negra de 1px, con la activa subrayada.
- Listado como **lista editorial numerada**, no rejilla de tarjetas. Aguanta 40
  entradas sin despeinarse.
- Ficha con pestañas _Resultado / Código_, el resultado en su `iframe` aislado.

## 4. Valores de la maqueta y valores finales

Los valores de la maqueta estaban escritos a pelo en el prototipo. Ya son tokens:
viven en `src/styles/tokens.css`, y el detalle está en
[04-fase-2-detalle.md](04-fase-2-detalle.md) §2. Cuatro colores se oscurecieron para
cumplir AA (2026-09-25).

| Uso                         | Maqueta                               | Final (AA)                |
| --------------------------- | ------------------------------------- | ------------------------- |
| Fondo                       | `#F2F1ED` (blanco roto cálido)        | igual                     |
| Tinta                       | `#141311`                             | igual                     |
| Texto secundario            | `#55524B`                             | igual                     |
| Texto terciario / metadatos | `#8A867C`                             | `#716E66`                 |
| Hover y foco                | `#00A5C4`                             | `#00788F`                 |
| Línea fina                  | `#DCDAD3`                             | igual                     |
| Acento CSS                  | `#E14B9B`                             | igual                     |
| Acento JS                   | `#D98E00`                             | `#BF7D00`                 |
| Acento React                | `#00A5C4`                             | `#0098B4`                 |
| Tipografía UI y titulares   | Archivo (400/500/600)                 | igual                     |
| Tipografía mono             | JetBrains Mono                        | igual                     |
| UI en mayúsculas            | 11px · 600 · `letter-spacing: 0.18em` | `1.1rem` · 600 · `0.18em` |

Los tres acentos salen de los matraces de neón del científico. **Su uso es
mínimo**: solo la categoría activa y el número de la ficha. El resto es negro
sobre blanco roto.

**Los acentos son líneas y marcas, nunca color de texto**: llegan a 3:1 sobre el
fondo, no a los 4.5:1 que pide AA para texto. La categoría activa se marca con un
subrayado del acento; el texto sigue en tinta.

## 5. Sistema de tokens — resuelto en la Fase 2

Resuelto en [04-fase-2-detalle.md](04-fase-2-detalle.md) §2:

- [x] Escala tipográfica completa, por rol.
- [x] Escala de espaciado de 13 pasos.
- [x] Colores como custom properties semánticas, en inglés (`--color-bg`,
      `--color-ink`, `--color-accent`…), no por su hex.
- [x] El acento **se queda**, con uso mínimo y solo en líneas y marcas.
- [ ] Modo oscuro: sale casi gratis con los tokens (decisión 4), pero no bloquea.
      Queda para la Fase 5, con `[data-theme="dark"]`.

## 6. Nota de arquitectura para cuando se maquete

La navegación por estados encaja de maravilla con las **View Transitions** de
Astro, pero **cada ejercicio necesita su propia URL** (`/labs/css/holy-grail`)
para poder compartirla con un cliente. Las dos cosas son compatibles; hay que
tenerlo presente el día que se maquete, no después.

## 7. Ficheros

- `.design/Main.dc.html` — fuente del prototipo. De aquí se regenera el lienzo.
- `.design/canvas.json` — disposición del lienzo.
- `.design/jmocanalab-direccion-visual.html` — el lienzo publicado (generado).
- `.design/cientifico.jpg` — copia reducida del asset, ya no se usa en la maqueta.
