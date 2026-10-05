# jmocanalab — Fase 3 en detalle: CodeViewer, las tres vistas y CI

> Fecha: 2026-10-05 · Estado: **aprobado (2026-10-05)**, en ejecución.
> Desarrolla la Fase 3 de [03-plan-implementacion.md](03-plan-implementacion.md).
> En lo visual manda [02-diseno.md](02-diseno.md) y la maqueta `.design/Main.dc.html`;
> los valores ya son tokens ([04-fase-2-detalle.md](04-fase-2-detalle.md) §2).

---

## 0. Decisiones que se cierran aquí

Todas aprobadas el 2026-10-05, también las que nacieron como **propuesta**.

1. **Las pestañas _Resultado / Código_ se mantienen** (`01-decisiones.md`). La maqueta
   pinta a la vez la pestaña activa y el bloque de código; se lee como un artefacto del
   prototipo, no como un diseño de "todo visible". (§2)
2. **Propuesta — código monocromo.** Tema de Shiki propio cuyos colores son `var(--…)`:
   sin resaltado de color, como la maqueta. (§2.3)
3. **Los comentarios del código van en `--color-ink-2`, no en `--color-ink-3`.** Sobre
   `--color-bg-code`, `ink-3` da 4.15:1 y no llega a AA; `ink-2` da 6.36:1. (§2.3)
4. **Las pestañas son una primitiva `ui/Tabs`**, con el patrón ARIA completo y un script
   mínimo. Se usa dos veces: _Resultado / Código_ y, dentro de _Código_, un fichero por
   pestaña cuando hay más de uno. (§2.4)
5. **Las fuentes se leen del disco en el build**, y si una ruta de `sources` o `entry` no
   existe, **el build falla** diciendo cuál. Nada de pestañas vacías. (§2.2)
6. **La 3.3 se da por cerrada** con la altura de un solo token y **sin `loading="lazy"`**:
   la demo es el contenido principal de la ficha y está sobre el pliegue. El plan decía lo
   contrario; se corrige. (§3)
7. **Propuesta — número de la ficha en tinta con un subrayado del acento**, igual que la
   categoría en Destacados. Cumple la decisión 7 (acento solo en líneas y marcas). (§6.2)
8. **El listado se genera para las tres categorías**, también las vacías, con un estado
   vacío. Así ninguna entrada de la nav da 404. (§5)
9. **Propuesta — View Transitions nativas entre documentos** (`@view-transition` en CSS)
   en lugar de `<ClientRouter />`. Cero JS. Además, el `transition:persist` del plan
   congelaría el `aria-current` de la nav. (§7)
10. **`aria-current="page"` solo en el listado de la categoría.** En la ficha, la
    categoría va con `aria-current="true"`: estás dentro de ella, no en su página. (§6.3)

---

## 1. Tareas, en orden

| #   | Tarea                                   | Estado real (2026-10-05)                            | Bloquea a |
| --- | --------------------------------------- | --------------------------------------------------- | --------- |
| 3.1 | `pnpm new:lab` ✅                       | Hecha (2026-10-01)                                  | —         |
| 3.2 | `ui/Tabs` + `lab/CodeViewer` ✅         | Hecha (2026-10-05); falta la prueba manual          | 3.6       |
| 3.3 | `LabFrame` ✅                           | Hecha en la Fase 2; plan corregido (2026-10-05)     | —         |
| 3.4 | Vista **Destacados** en `/`             | Repasada (2026-10-05)                               | —         |
| 3.5 | Vista **Listado** en `/labs/[category]` | Hecha (2026-10-05); la nav ya no da 404             | 3.7       |
| 3.6 | Vista **Ficha** completa                | Versión mínima: título, resumen, iframe             | 3.7       |
| 3.7 | View Transitions                        | Sin empezar                                         | —         |
| 3.8 | CI en GitHub Actions                    | Sin empezar. Independiente: cabe en cualquier hueco | —         |

Se sigue el orden del plan. La 3.2 se monta desde el primer día en la ficha mínima que
ya existe, con el lab `prueba`; la 3.6 completa después lo que la rodea.

---

## 2. Tarea 3.2 — `CodeViewer`

### 2.1 Qué hace

Recibe un experimento y pinta las pestañas _Resultado / Código_:

- **Resultado**: lo que le llegue por slot. La ficha mete ahí `LabFrame` (`iframe`) o el
  componente de la demo (`inline`). El `CodeViewer` no sabe de runtimes.
- **Código**: un bloque por cada ruta de `sources`, resaltado en build.
  - Con **un** fichero: su nombre encima del bloque, como en la maqueta (mono, subrayado
    en tinta). No es una pestaña, es una etiqueta.
  - Con **más de uno**: una pestaña por fichero, con la misma apariencia.
  - Con **ninguno** (`sources: []`): no hay pestaña _Código_ y, por tanto, tampoco
    pestañas. Se pinta solo el resultado.

Sin botón de copiar, sin números de línea, sin título de lenguaje. Ante la duda, quitar.

### 2.2 Lectura de las fuentes

- `node:fs/promises` en el frontmatter, con la ruta resuelta desde la raíz del proyecto
  (`entry` y `sources` son relativas a la raíz, `04` §3.1). Se ejecuta en build; al
  navegador llega HTML.
- No se usa `import.meta.glob('…?raw')`: no puede leer `public/`, que es justo donde
  viven las demos `iframe`.
- **Si un fichero no existe, se lanza un error** con la ficha y la ruta. Un build roto
  avisa; una pestaña vacía en producción, no.
- El lenguaje sale de la extensión, con un objeto de consulta en `constants/`:

  ```ts
  const LANGUAGE_BY_EXTENSION = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    ts: 'typescript',
    astro: 'astro',
  } as const;
  ```

  Lo que no esté en la tabla se pinta como `plaintext`. Se amplía cuando aparezca el
  primer `.jsx` o `.tsx` (Fase 4 o nivel `island`).

- La función que lee las fuentes (`readSources`) vive en `lab/CodeViewer/containers/`:
  lee del disco, así que no es una función pura y no cabe en `utils/`. La parte pura
  (extensión → lenguaje) sí está en `utils/code-language.ts`.

### 2.3 Resaltado: Shiki sin dependencias nuevas

Astro 7 trae Shiki 4 y lo expone con `<Code>` de `astro:components`. No se añade nada a
`package.json`.

**Propuesta: tema monocromo propio.** Un objeto de tema de Shiki en
`constants/` cuyos colores no son hex sino custom properties:

| Ámbito           | Color                   | Ratio sobre `--color-bg-code` |
| ---------------- | ----------------------- | ----------------------------- |
| Fondo del bloque | `var(--color-bg-code)`  | —                             |
| Todo el código   | `var(--color-ink-code)` | 9.59                          |
| Comentarios      | `var(--color-ink-2)`    | 6.36                          |

`--color-ink-3` queda descartado: 4.15:1 sobre el fondo de código.

Así no entra ni un hex fuera de `tokens.css` y el modo oscuro de la Fase 5 se lleva el
código gratis. Shiki escribe esos valores como `style` en línea; se acepta porque son
valores generados que solo apuntan a tokens, que es la excepción que ya prevé
`CLAUDE.md` §5.

**Verificado (2026-10-05)**: Shiki 4 acepta `var(--…)` como color de tema y lo escribe
tal cual en el HTML (`style="color:var(--color-ink-code)"`).

Opción descartada, por si se reabre: un tema estándar con color (`github-light`). Se lee
mejor, pero mete una paleta que no es la del sitio.

El tipo del tema se saca de `ComponentProps<typeof Code>['theme']` (`astro/types`):
`shiki` no es dependencia directa y con pnpm no se puede importar.

### 2.4 Pestañas accesibles — `ui/Tabs`

Primitiva sin dominio en `src/components/ui/Tabs/`, como prevé la skill `maquetacion`.

- Marcado: `role="tablist"` con `aria-label`, cada pestaña un `<button role="tab">` con
  `aria-selected` y `aria-controls`, cada panel `role="tabpanel"` con `aria-labelledby`.
- Teclado: ←/→ cambian de pestaña, Inicio/Fin van a la primera y la última, `Tab` sale de
  la lista al panel. Tabindex móvil: solo la pestaña activa es tabulable.
- **Activación automática** (la pestaña se activa al recibir foco): el contenido ya está
  en el DOM y no hay coste de carga.
- **El estado inicial se resuelve en el HTML**: _Resultado_ visible y _Código_ con
  `hidden`. Sin saltos de layout al cargar el script.
- **Los paneles son un componente aparte, `TabPanel`**, que el consumidor pone en el slot
  de `Tabs`, uno por pestaña. La primera versión usaba un slot con nombre por panel, pero
  Astro no admite nombres de slot dinámicos dentro de un `map`, y las pestañas de fichero
  se generan así.
- El script es un módulo de Astro (`<script>`), se empaqueta una vez aunque haya dos
  `Tabs` en la página y engancha cada `.tabs__list` que encuentre. Ocupa 662 bytes
  minificado y Astro lo mete en línea.
- **Sin JS** se ve el resultado y no el código. Se acepta: el sitio no promete funcionar
  sin JS, solo enviar el mínimo. (Alternativa anotada: un atributo `data-js` puesto en el
  `<head>` y paneles ocultos solo por CSS cuando existe. Más piezas por un caso marginal.)
- Estilo de la maqueta: `eyebrow`, inactiva en `--color-ink-3`, activa en tinta con
  `--border-active` del acento, y la línea fina de `--color-line` bajo la lista.
- El `<pre>` de Shiki lleva `tabindex="0"` (comprobado en el HTML generado): si hay
  scroll horizontal, se alcanza con teclado.

### 2.5 Ficheros

Convención real del repo (decisión 3 de `estado-sesion.md`): un componente, una carpeta
con `.astro` + `.css`, y `containers/`, `UI/`, `utils/`, `constants/` o `types.ts` dentro
cuando hacen falta.

```
src/components/
├── ui/Tabs/
│   ├── Tabs.astro              # tablist + slot de paneles + script de teclado
│   ├── Tabs.css
│   ├── UI/TabPanel.astro       # un panel; va en el slot de Tabs
│   └── utils/
│       ├── next-index.ts       # tecla → pestaña de destino (pura)
│       └── tab-ids.ts          # ids que enlazan pestaña y panel
└── lab/CodeViewer/
    ├── CodeViewer.astro
    ├── CodeViewer.css
    ├── containers/read-sources.ts
    ├── constants/index.ts      # lenguajes, tema monocromo, ids y textos
    ├── utils/code-language.ts
    └── types.ts
```

Ojo: el ejemplo de la skill `javascript` (`components/code-viewer/containers/…`) no
coincide con esta convención. Se corrige la skill al cerrar la fase (§9).

### 2.6 Hecho cuando

- [x] `/labs/css/prueba` muestra _Resultado / Código_ y el `index.html` resaltado.
- [ ] Teclado completo en las pestañas; foco visible; lector de pantalla anuncia
      "pestaña, seleccionada, 1 de 2". **Pendiente de prueba manual en el navegador.**
- [x] Una ruta inexistente en `sources` rompe el build con un mensaje claro.
- [x] Varios ficheros generan las pestañas secundarias (probado con una ficha temporal).
- [x] Ni un hex nuevo; `pnpm lint`, `typecheck` y `build` en limpio.

---

## 3. Tarea 3.3 — `LabFrame`: cierre

Ya está hecho en la Fase 2 (`src/components/lab/LabFrame/`). Lo que queda es documental:

- **Altura**: `--height-frame` (40rem) para todas las demos. El plan hablaba de "altura
  declarada" por ficha; no hace falta un campo en el frontmatter hasta que una demo lo
  pida. El día que pase, un `frameHeight` opcional en el esquema.
- **`loading="lazy"`: no.** La skill `maquetacion` ya lo dice: no en el contenido
  principal sobre el pliegue. Se corrige la tabla de `03`.

**Cerrada (2026-10-05).** Tabla de `03` corregida; el código no cambia.

---

## 4. Tarea 3.4 — Destacados: repaso

Funciona (`src/pages/index.astro`): filtra `featured`, ordena por fecha descendente y
numera dentro de cada categoría. Repaso contra la maqueta, sin cambios de diseño:

- [x] Encabezado `Destacados` en `eyebrow` y `--color-ink-3`, con `--space-6` debajo (20
      en la maqueta).
- [x] Categoría en tinta con subrayado del acento (ya cumple la decisión 7).
- [x] Estado vacío: si no hay ningún `featured`, no se pinta la sección.
- [x] **Separaciones de página corregidas** desde 768, que no seguían `04` §2.3:
  - Arriba de la cabecera: `--space-8` → `--space-11` (46 en la maqueta).
  - Entre la nav y el contenido: `--space-10` → `--space-12` (62 en la maqueta).
  - En móvil se quedan los valores compactos de antes.
- [x] `text-wrap: pretty` en el resumen de la fila, como en la maqueta.

**Cerrada (2026-10-05).** Queda para la 3.6: en la maqueta, la ficha arranca a 46 de la
nav, no a 62. El `padding-block-start` de `.site-main` vale para las listas; la ficha
necesitará el suyo.

---

## 5. Tarea 3.5 — Listado en `/labs/[category]`

`src/pages/labs/[category]/index.astro`, con `getStaticPaths` sobre `CATEGORIES`: **las
tres categorías, aunque estén vacías**. Hoy `/labs/js` y `/labs/react` dan 404.

- **Orden**: por número ascendente (`001` arriba), como la maqueta. Es un índice de
  colección; lo reciente ya lo enseña Destacados.
- **Encabezado**: el nombre de la categoría como `h1` en `eyebrow`. La maqueta lo pinta en
  color de acento: no cumple la decisión 7, así que va en tinta con subrayado del acento.
- **Contador** a la derecha, `--color-ink-3`: `4 ejercicios` (`1 ejercicio` en singular).
  Está en la maqueta. **Propuesta: se queda**, pero es el primer candidato si sobra algo.
- **Filas**: `LabList` + `LabRow` con las etiquetas como metadato.
- **Estado vacío**: un párrafo en `--color-ink-2`, "Todavía no hay ejercicios de
  React.", entre las dos líneas finas de una fila. Sin ilustración, sin enlace de
  vuelta y **sin contador**: "0 ejercicios" repetiría el aviso.
- `<title>`: `CSS · jmocanalab`. `data-category` en el `<body>` vía `activeCategory`.
- Los labs con `status: idea` aparecen en el listado, como en la maqueta.

**Cerrada (2026-10-05).** Cómo quedó:

- `LabList` cambia `meta` + `headingLevel` por una sola prop, `view: 'featured' | 'category'`.
  Es la vista la que decide el nivel del encabezado (`h2`/`h1`), el metadato de fila, el
  contador y el estado vacío. Así no se pueden pedir combinaciones que no existen.
- El contador sale de `LabList/utils/count-label.ts`.
- Se genera `/labs/css`, `/labs/js` y `/labs/react`; la nav ya no da 404.
- "Ejercicios" y no "experimentos" en el aviso, para que case con el contador.

---

## 6. Tarea 3.6 — Ficha completa

### 6.1 Estructura (de arriba abajo, según la maqueta)

1. **Volver**: flecha SVG (`aria-hidden`) + `Volver a CSS` en `eyebrow`, enlace a
   `/labs/css`. El texto da el nombre accesible; no hace falta `aria-label`.
2. **Rejilla de dos columnas** desde 768: número (6.6rem) + contenido, con
   `--space-8` de separación. En móvil, el número sobre el título (como en `LabRow`).
3. **Número** `--text-num` (ver §6.2).
4. **Título** `h1`, `--text-xl`, `max-width: var(--width-title)`.
5. **Resumen**, `--text-m`, `--color-ink-2`, `max-width: var(--width-text)`.
6. **Metadatos** en una línea, mono `--text-mono-s`, `--color-ink-3`: etiquetas ·
   runtime · fecha. Como `<dl>` con los `<dt>` visualmente ocultos (`Etiquetas`,
   `Ejecución`, `Fecha`): para quien lee, valores sueltos; para el lector de pantalla,
   pares con nombre. Fecha en `<time datetime>`, con
   `Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })`.
   Ojo: da `12 sept 2026`, no el `12 sep` de la maqueta. Se acepta el de la plataforma.
7. **`CodeViewer`** con el resultado según el runtime (§6.4).
8. **Propuesta — cuerpo del `.md`** bajo el `CodeViewer`, solo si no está vacío, con
   `max-width: var(--width-text)` y estilos mínimos de texto (párrafo, `h2`, lista,
   código en línea). Si no se pinta, el cuerpo de la ficha no sirve para nada; si se
   pinta, es donde se explica el experimento.

Fuera de la ficha en esta fase: estado editorial, `updated`, `links`, `cover`.

### 6.2 El número de la ficha

Pendiente de `estado-sesion.md`. La maqueta lo pone en color de acento, pero es texto
de 15px y el acento no llega a 4.5:1.

- **Propuesta (a)**: tinta con `--border-active` del acento debajo, igual que la
  categoría en Destacados. Coherente y cumple AA.
- (b) Sin acento: `--color-ink-3`, como en las filas.

### 6.3 `aria-current` en la nav

Hoy `SiteHeader` pone `aria-current="page"` siempre que hay categoría activa, también en
la ficha. Se separa: `page` en el listado, `true` en la ficha. El subrayado se mantiene
en los dos casos. Es un cambio de una prop en `SiteHeader`.

### 6.4 Resultado según el runtime

Objeto de consulta, sin `switch`:

- `iframe` → `LabFrame` con `demoPath(lab)`.
- `inline` → el componente cuyo fichero es `entry`, buscado en
  `import.meta.glob('/src/demos/**/*.astro', { eager: true })`. Si no está, error de
  build. Va dentro de un contenedor con el mismo marco que el `iframe` (borde fino,
  `--color-bg-raised`) pero con altura automática.
- `island` → **error de build** con un mensaje explícito: el esquema lo admite, pero no
  hay integración de React. Mejor que una ficha vacía.

### 6.5 Lo que sube a común

`formatNumber` (`lab/LabRow/utils/`) pasa a usarlo también la ficha: se sube a
`src/utils/`, como manda la skill `javascript`.

---

## 7. Tarea 3.7 — View Transitions

### 7.1 Propuesta: nativas, sin `<ClientRouter />`

```css
@view-transition {
  navigation: auto;
}
```

- **Cero JS.** El navegador hace la transición entre dos documentos normales. Encaja con
  la regla de que gana la URL: son navegaciones reales.
- **Cabecera quieta**: `view-transition-name: site-header` en la cabecera. Como es igual
  en las dos páginas, no se nota el cambio; solo el bloque central funde.
- **`prefers-reduced-motion: reduce`** → sin animación (skill `maquetacion`).
- Donde no hay soporte (a fecha de escribir esto, Firefox), se navega sin efecto. Es
  mejora progresiva.

### 7.2 Por qué no `<ClientRouter />` con `transition:persist`

1. Es JS en todas las páginas para un efecto.
2. `transition:persist` en la cabecera **mantiene el DOM viejo**: el subrayado y el
   `aria-current` de la categoría se quedarían en la página anterior.
3. El script de `Tabs` tendría que volver a engancharse en cada `astro:page-load`.

Si un día hace falta algo que solo da el router (persistir estado, animar entre
navegadores sin soporte), se reabre.

---

## 8. Tarea 3.8 — CI

`.github/workflows/ci.yml`, en cada push y cada PR:

1. `actions/checkout`
2. `pnpm/action-setup` (lee `packageManager`: pnpm 10.24)
3. `actions/setup-node` con `node-version-file: .nvmrc` y caché de pnpm
4. `pnpm install --frozen-lockfile`
5. `pnpm lint` · `pnpm typecheck` · `pnpm format:check` · `pnpm build`

Vercel ya construye cada rama; el CI añade lo que Vercel no mira: lint, tipos y formato.
Antes de añadir `format:check`, comprobar que hoy pasa en limpio.

`gh` no está instalado: el workflow se ve funcionar en la pestaña _Actions_ tras el push,
que hace el usuario.

---

## 9. Documentación y skills al cerrar la fase

- `03-plan-implementacion.md`: tabla de la Fase 3 con estados; 3.3 sin `lazy`; 3.7 sin
  `transition:persist`.
- `estado-sesion.md`: decisiones de §0 y pendientes nuevos.
- Skill `javascript`: el ejemplo de estructura con la convención real (§2.5).
- Skill `maquetacion`: patrón de pestañas, `aria-current` `page`/`true`, View Transitions
  nativas.
- Skill `nuevo-lab`: qué pinta la ficha según el runtime y qué rompe el build.
- `CLAUDE.md`: estado → Fase 4.

---

## 10. Definición de "Fase 3 terminada"

- [ ] `pnpm new:lab` → editar la demo → commit → publicado, **sin tocar nada más**.
      Probado con un `iframe` y un `inline` de usar y tirar (se borran después).
- [ ] Las tres entradas de la nav responden; ninguna da 404.
- [ ] La ficha muestra número, metadatos, _Resultado / Código_ y el código resaltado.
- [ ] Pestañas operables con teclado y anunciadas bien por lector de pantalla.
- [ ] Transición entre vistas sin mover la cabecera, y sin animación con movimiento
      reducido.
- [ ] El CI pasa en verde en GitHub.
- [ ] Ni un hex fuera de `tokens.css`; AA en todo lo nuevo.

Lo que **no** entra en esta fase: React y el nivel `island`, modo oscuro, RSS, OG,
`frameHeight`, el `<head>` definitivo (favicon, `theme-color`, precarga de fuente) y el
ancho máximo de página por encima de 1200.
