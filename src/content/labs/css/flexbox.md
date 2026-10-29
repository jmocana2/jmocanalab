---
title: 'Flexbox'
summary: 'Flexbox es el modelo de CSS para colocar elementos en una sola dimensión, en fila o en columna, y decidir cómo se reparten entre ellos el espacio disponible. ¿Te atreves con los ejercicios que te propongo?'
intro:
  - 'Antes de Flexbox, centrar algo en vertical o conseguir que tres columnas llenaran el ancho pedía floats, tablas o cuentas a mano. Con Flexbox el trabajo pasa al contenedor: tú declaras la dirección, cómo se alinean los hijos y cuánto puede crecer o encoger cada uno, y el navegador hace las cuentas. Es la herramienta natural para barras de navegación, botones con icono, tarjetas o cualquier fila de elementos que tenga que adaptarse al hueco que le toca.'
  - 'Para ponerlo en práctica, aquí abajo tienes diez ejercicios. Empiezan por lo básico, poner unas cajas en fila, y terminan en lo que más cuesta: el reparto del espacio con flex-grow, flex-shrink, flex-basis y el atajo flex. Escribe CSS hasta que tus cajas encajen con el objetivo; vale cualquier solución que lo consiga. El progreso se guarda en tu navegador, así que puedes dejarlo a medias y volver cuando quieras.'
  - 'Si lo deseas, antes de empezar puedes ver el [curso de Flexbox de midudev](https://www.youtube.com/watch?v=PSwlAuRbv_A) en YouTube o leer [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), de CSS-Tricks. Son mis dos referencias de cabecera sobre Flexbox: claras, completas y muy recomendables, tanto para aprenderlo como para volver a ellas cuando se te olvide algo.'
category: css
kind: exercise
tags: [flexbox, layout]
date: 2026-10-29
status: wip
featured: false
runtime: iframe
entry: public/demos/css/flexbox/index.html
sources: []
frameHeight: 75
---

## Los dos ejes

Flexbox trabaja siempre sobre dos ejes. El **principal** lo marca `flex-direction`: en
horizontal con `row` y en vertical con `column`. El **cruzado** es el perpendicular. Casi
todo se entiende sabiendo en qué eje actúa cada propiedad: `justify-content` en el
principal, `align-items` y `align-content` en el cruzado.

## En el contenedor

<figure>
<svg width="480" height="250" viewBox="0 0 480 250" fill="none" stroke="currentColor" role="img" aria-label="Un contenedor con tres cajas en fila. Una flecha horizontal marca el eje principal, que controla justify-content; una flecha vertical marca el eje cruzado, que controla align-items.">
<rect x="50.5" y="10.5" width="423" height="200"/>
<rect x="68.5" y="30.5" width="80" height="110" fill="currentColor" fill-opacity="0.12"/>
<rect x="160.5" y="30.5" width="80" height="110" fill="currentColor" fill-opacity="0.12"/>
<rect x="252.5" y="30.5" width="80" height="110" fill="currentColor" fill-opacity="0.12"/>
<line x1="68" y1="184" x2="456" y2="184" stroke-width="2" data-accent/>
<polyline points="447,177 457,184 447,191" stroke-width="2" data-accent/>
<line x1="34" y1="20" x2="34" y2="200" stroke-width="2" data-accent/>
<polyline points="27,191 34,201 41,191" stroke-width="2" data-accent/>
<g fill="currentColor" stroke="none" font-size="16" text-anchor="middle">
<text x="108" y="91">1</text>
<text x="200" y="91">2</text>
<text x="292" y="91">3</text>
<text x="154" y="163" font-size="13">gap</text>
<text transform="translate(18 110) rotate(-90)" font-size="15">eje cruzado · align-items</text>
<text x="50" y="238" font-size="15" text-anchor="start">eje principal · justify-content</text>
</g>
</svg>
<figcaption>Con <code>flex-direction: row</code>, el eje principal es horizontal. Con <code>column</code> los ejes giran, y <code>justify-content</code> pasa a trabajar en vertical.</figcaption>
</figure>

- `display: flex` convierte a los hijos directos en elementos flexibles.
- `flex-direction`: `row`, `row-reverse`, `column` o `column-reverse`.
- `flex-wrap`: si los elementos pueden saltar a otra línea. Por defecto, `nowrap`.
- `justify-content`: reparto en el eje principal (`flex-start`, `center`,
  `space-between`, `space-around`, `space-evenly`…).
- `align-items`: alineación de cada elemento dentro de su línea, en el eje cruzado.
- `align-content`: reparto de las líneas en el eje cruzado. Solo actúa con `wrap`.
- `gap`: separación entre elementos, sin márgenes.

## En los elementos

<figure>
<svg width="480" height="260" viewBox="0 0 480 260" fill="none" stroke="currentColor" role="img" aria-label="Arriba, un contenedor con espacio de sobra: cada caja parte de su flex-basis y el espacio libre se reparte en partes 1, 2 y 1 según flex-grow. Abajo, tres cajas que no caben: cada una cede una parte proporcional a su flex-shrink por su flex-basis.">
<rect x="0.5" y="30.5" width="479" height="56"/>
<rect x="4.5" y="38.5" width="84" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="92.5" y="38.5" width="59" height="40" stroke-dasharray="4 3" data-accent/>
<rect x="159.5" y="38.5" width="54" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="217.5" y="38.5" width="124" height="40" stroke-dasharray="4 3" data-accent/>
<rect x="349.5" y="38.5" width="64" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="417.5" y="38.5" width="58" height="40" stroke-dasharray="4 3" data-accent/>
<rect x="0.5" y="168.5" width="379" height="56"/>
<rect x="4.5" y="176.5" width="101" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="111.5" y="176.5" width="130" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="247.5" y="176.5" width="128" height="40" fill="currentColor" fill-opacity="0.12"/>
<rect x="384.5" y="176.5" width="40" height="40" stroke-dasharray="4 3" data-accent/>
<g fill="currentColor" stroke="none" font-size="15" text-anchor="middle">
<text x="0" y="18" text-anchor="start">Sobra espacio: flex-grow reparte lo libre</text>
<text x="46" y="63">A</text>
<text x="122" y="63">+1</text>
<text x="186" y="63">B</text>
<text x="279" y="63">+2</text>
<text x="381" y="63">C</text>
<text x="446" y="63">+1</text>
<text x="0" y="112" font-size="13" text-anchor="start">relleno: flex-basis · discontinuo: lo que crece</text>
<text x="0" y="156" text-anchor="start">Falta espacio: flex-shrink recorta</text>
<text x="55" y="201">A</text>
<text x="176" y="201">B</text>
<text x="311" y="201">C</text>
<text x="404" y="201" font-size="13">−40</text>
<text x="0" y="250" font-size="13" text-anchor="start">cada caja cede en proporción a flex-shrink × flex-basis</text>
</g>
</svg>
<figcaption><code>flex-grow</code> solo reparte lo que <strong>sobra</strong> después de <code>flex-basis</code>; <code>flex-shrink</code> solo recorta lo que <strong>falta</strong>, y las cajas grandes ceden más.</figcaption>
</figure>

- `order`: cambia el orden visual, no el del DOM ni el de tabulación.
- `align-self`: el `align-items` de un solo elemento.
- `flex-basis`: el tamaño de partida en el eje principal. Si no vale `auto`, manda sobre
  `width`.
- `flex-grow`: cuánto se queda del espacio que **sobra**, en proporción a los demás.
- `flex-shrink`: cuánto cede cuando **falta** espacio, ponderado por su `flex-basis`.

## El atajo `flex`

<figure>
<svg width="480" height="290" viewBox="0 0 480 290" fill="none" stroke="currentColor" role="img" aria-label="flex: 1 1 0% desglosado: el primer valor es crecer (flex-grow), el segundo encoger (flex-shrink) y el tercero el tamaño de partida (flex-basis). Debajo, con flex: auto las cajas parten de su contenido y reparten lo que sobra; con flex: 1 parten de cero y salen iguales.">
<line x1="168" y1="54" x2="212" y2="54" stroke-width="2" data-accent/>
<line x1="268" y1="54" x2="312" y2="54" stroke-width="2" data-accent/>
<line x1="362" y1="54" x2="418" y2="54" stroke-width="2" data-accent/>
<rect x="0.5" y="150.5" width="479" height="44"/>
<rect x="4.5" y="156.5" width="34" height="32" fill="currentColor" fill-opacity="0.12"/>
<rect x="42.5" y="156.5" width="94" height="32" stroke-dasharray="4 3" data-accent/>
<rect x="144.5" y="156.5" width="104" height="32" fill="currentColor" fill-opacity="0.12"/>
<rect x="252.5" y="156.5" width="94" height="32" stroke-dasharray="4 3" data-accent/>
<rect x="354.5" y="156.5" width="24" height="32" fill="currentColor" fill-opacity="0.12"/>
<rect x="382.5" y="156.5" width="93" height="32" stroke-dasharray="4 3" data-accent/>
<rect x="0.5" y="236.5" width="479" height="44"/>
<rect x="4.5" y="242.5" width="152" height="32" stroke-dasharray="4 3" data-accent/>
<rect x="164.5" y="242.5" width="152" height="32" stroke-dasharray="4 3" data-accent/>
<rect x="324.5" y="242.5" width="151" height="32" stroke-dasharray="4 3" data-accent/>
<g fill="currentColor" stroke="none" text-anchor="middle">
<g font-family="ui-monospace, Menlo, Consolas, monospace" font-size="26">
<text x="80" y="42">flex:</text>
<text x="190" y="42">1</text>
<text x="290" y="42">1</text>
<text x="390" y="42">0%</text>
</g>
<g font-size="15">
<text x="190" y="80">crecer</text>
<text x="290" y="80">encoger</text>
<text x="390" y="80">partida</text>
</g>
<g font-size="12">
<text x="190" y="100">flex-grow</text>
<text x="290" y="100">flex-shrink</text>
<text x="390" y="100">flex-basis</text>
</g>
<g font-size="15" text-anchor="start">
<text x="0" y="140">flex: auto · parte del contenido y reparte lo que sobra</text>
<text x="0" y="226">flex: 1 · parte de cero: las tres, iguales</text>
</g>
<g font-size="15">
<text x="22" y="178">A</text>
<text x="196" y="178">B</text>
<text x="366" y="178">C</text>
<text x="80" y="264">A</text>
<text x="240" y="264">B</text>
<text x="400" y="264">C</text>
</g>
</g>
</svg>
<figcaption>Tres valores, siempre en el mismo orden: <strong>crecer, encoger y tamaño de partida</strong>.</figcaption>
</figure>

- `flex: initial` equivale a `0 1 auto`. Es el valor por defecto: no crece, pero sí
  encoge.
- `flex: 1` equivale a `1 1 0%`. Parte de cero y se reparte todo el espacio.
- `flex: auto` equivale a `1 1 auto`. Parte de su contenido y se reparte lo que sobra.
- `flex: none` equivale a `0 0 auto`. Rígido: ni crece ni encoge.
- `flex: 1 0 auto` crece, no encoge nunca y parte de su tamaño natural.

La diferencia entre `flex: 1` y `flex: auto` es la del acordeón: con `0%` se reparte el
contenedor entero y las proporciones salen exactas; con `auto` solo se reparte lo que
sobra después del contenido.

## Referencias

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/),
  en CSS-Tricks.
- [Curso de Flexbox de midudev](https://www.youtube.com/watch?v=PSwlAuRbv_A), en YouTube.
