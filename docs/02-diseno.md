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

## 4. Valores actuales de la maqueta — PROVISIONALES

⚠️ Estos números están escritos a pelo en el prototipo. **No son los tokens.**
Se afinan en la sesión siguiente (ver punto 5).

| Uso                         | Valor de trabajo                      |
| --------------------------- | ------------------------------------- |
| Fondo                       | `#F2F1ED` (blanco roto cálido)        |
| Tinta                       | `#141311`                             |
| Texto secundario            | `#55524B`                             |
| Texto terciario / metadatos | `#8A867C`                             |
| Línea fina                  | `#DCDAD3`                             |
| Acento CSS                  | `#E14B9B`                             |
| Acento JS                   | `#D98E00`                             |
| Acento React                | `#00A5C4`                             |
| Tipografía UI y titulares   | Archivo (400/500/600)                 |
| Tipografía mono             | JetBrains Mono                        |
| UI en mayúsculas            | 11px · 600 · `letter-spacing: 0.18em` |

Los tres acentos salen de los matraces de neón del científico. **Su uso es
mínimo**: solo la categoría activa y el número de la ficha. El resto es negro
sobre blanco roto.

## 5. Pendiente para la próxima sesión

**Sistema de tokens.** Es el trabajo real que queda de la Fase 1:

- [ ] Escala tipográfica completa (no valores sueltos: una escala).
- [ ] Escala de espaciado coherente.
- [ ] Nombrar los colores como custom properties semánticas
      (`--color-fondo`, `--color-tinta`, `--color-acento`…), no por su hex.
- [ ] Decidir si el acento se queda o el sitio va estrictamente en blanco y negro.
      **Sin resolver**: se planteó y no llegó a decidirse.
- [ ] Modo oscuro: sale casi gratis con los tokens (decisión 4), pero no bloquea.

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
