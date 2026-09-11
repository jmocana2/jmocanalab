# jmocanalab — Plan de implementación por fases

> Fecha: 2026-09-11 · Estado: **propuesto**.
> Cierra la serie: [00-analisis-inicial.md](00-analisis-inicial.md) ·
> [01-decisiones.md](01-decisiones.md) · [02-diseno.md](02-diseno.md).
> En lo visual manda `02-diseno.md`; en lo técnico, este documento.

---

## 0. Punto de partida

Lo que ya está hecho: análisis (Fase 0 del análisis), decisiones cerradas y la
dirección visual aprobada con maqueta en `.design/`. Lo que **no** existe todavía:
ni una línea de código. El directorio solo tiene `docs/` y `.design/`.

Lo que este plan asume como resuelto y no vuelve a discutir:

- Astro estático, TS strict, pnpm, CSS moderno con tokens, sin Tailwind/SASS.
- Categorías `css · js · react`. Sin `ia`, sin i18n, sin demos embebidas de terceros.
- Repo **público** → la línea roja de cliente (decisión 10) va en `CLAUDE.md`.
- Estética: aire, mayúsculas pequeñas con tracking, monocromo + acento mínimo,
  numeración `001` como hilo conductor. **Ante la duda, quitar.**

### La única contradicción que hay que resolver antes de teclear

`02-diseno.md` describe **una pantalla con tres estados**; el análisis y la decisión 3
exigen **una URL por ejercicio**. No son incompatibles, pero el orden importa:

> **Se implementan páginas reales con URL propia** (`/`, `/labs/css`,
> `/labs/css/holy-grail`) y la sensación de "un solo bloque que cambia" se consigue con
> **View Transitions** de Astro: cabecera y fila de categorías quedan fuera de la
> transición, el bloque central se sustituye. Cero estado en JS, cero router propio,
> URLs compartibles desde el día 1.

Si en algún momento hay que elegir entre el efecto y la URL, **gana la URL**.

---

## Fase 2 — Esqueleto que llega a producción

> ▶ Detalle completo de esta fase, con los tokens ya extraídos de la maqueta y la
> incorporación de Storybook: [04-fase-2-detalle.md](04-fase-2-detalle.md) (2026-09-11).

**Objetivo**: una demo de mentira, de punta a punta, desplegada. Valida el modelo
completo antes de invertir en contenido.

| # | Tarea | Entregable |
|---|---|---|
| 2.1 | `git init`, `.gitignore` con `.env*`, `CLAUDE.md` con la línea roja | repo local |
| 2.2 | Scaffold Astro + TS strict + Prettier + ESLint (flat) + `packageManager` + `.nvmrc` | `pnpm dev` levanta |
| 2.3 | `src/content.config.ts` con el esquema Zod de 3.5 del análisis, tal cual | tipos en las colecciones |
| 2.4 | `src/styles/tokens.css` — **el trabajo pendiente de la Fase 1** (ver abajo) | contrato de estilos |
| 2.5 | Layout base: cabecera `jmocanalab`, fila de categorías, footer con iconos SVG | maqueta navegable |
| 2.6 | Un lab de prueba `css/prueba` con `runtime: iframe` y su `public/labs/css/prueba/index.html` | ruta real |
| 2.7 | Repo en GitHub + Vercel conectado, preview por PR | `jmocanalab.vercel.app` |

### 2.4 en detalle — los tokens (bloqueante de todo lo visual)

Es lo que `02-diseno.md` §5 dejó abierto. Los valores de la maqueta son provisionales;
aquí se convierten en sistema:

- Nombres **semánticos**, nunca el hex ni el rol de color:
  `--color-fondo`, `--color-tinta`, `--color-tinta-2`, `--color-tinta-3`,
  `--color-linea`, `--color-acento`.
- Acento **por categoría** como custom property que se hereda:
  `--color-acento` se redefine en `[data-categoria="css"|"js"|"react"]`.
- **Escala tipográfica**, no tamaños sueltos. Propuesta de partida: un único ratio
  con `clamp()` para el titular y pasos fijos para el resto, dado que el diseño solo
  usa dos registros (titular grande / UI diminuta en mayúsculas).
- **Escala de espaciado** de un solo eje, en múltiplos de 4px, expuesta como
  `--e-1 … --e-8`. El aire es el layout: se controla desde aquí o no se controla.
- `@layer reset, tokens, base, componentes, utilidades` desde el primer fichero.
  Añadirlo después obliga a revisar toda la cascada.

**Decisión que sigue sin tomar y hay que tomar aquí**: si el acento se queda o el
sitio va estrictamente en blanco y negro. Recomendación: **se queda**, pero limitado
a categoría activa y número de ficha, como ya dice el diseño. Con tokens, revertirlo
es cambiar tres valores a `var(--color-tinta)`.

**Modo oscuro**: se dejan los tokens preparados (`:root` + `[data-tema="oscuro"]`),
pero **no se implementa el toggle en esta fase**. No bloquea.

**Salida de fase**: la URL de Vercel muestra la home con su fila de categorías y una
ficha de prueba que renderiza su iframe. Nada más.

---

## Fase 3 — Fricción cero

**Objetivo**: que añadir un experimento cueste dos minutos. Es la fase que decide si
el proyecto vive.

| # | Tarea | Nota |
|---|---|---|
| 3.1 | `scripts/new-lab.mjs` + `pnpm new:lab` | pregunta categoría, título y runtime; genera `.mdx` con frontmatter completo y, si es `iframe`, la carpeta en `public/labs/` con `index.html` mínimo |
| 3.2 | `CodeViewer` con Shiki | lee `sources[]` del frontmatter, pestañas *Resultado / Código* |
| 3.3 | `LabFrame` | el `<iframe>` del nivel B, con altura declarada y `loading="lazy"` |
| 3.4 | Vista **Destacados** en `/` | filas numeradas, `featured: true`, orden por fecha |
| 3.5 | Vista **Listado** en `/labs/[categoria]` | lista editorial numerada, sin tarjetas |
| 3.6 | Vista **Ficha** en `/labs/[categoria]/[slug]` | pestañas + numeración + acento de categoría |
| 3.7 | View Transitions entre las tres vistas | cabecera y nav con `transition:persist` |
| 3.8 | CI en GitHub Actions: lint + typecheck + build | |

La numeración (`001`, `002`…) se calcula **al construir**, por orden de fecha dentro
de la categoría. No es un campo del frontmatter: un campo manual es fricción y se
desincroniza a la tercera entrada.

**Salida de fase**: `pnpm new:lab` → editar un `index.html` → commit → está publicado.

---

## Fase 4 — Los dos primeros experimentos de verdad

Los que fija la decisión 6, y que sirven de plantilla viva:

1. **CSS — Flexbox y Grid** (`runtime: iframe`, nivel B). Valida el aislamiento total,
   que es el caso por defecto del sitio.
2. **JS — Programación Orientada a Objetos** (`runtime: inline`, nivel A). Valida el
   camino sin iframe y el `CodeViewer` sobre código que no se "ejecuta" visualmente.

El nivel C (`island`, React) **se deja para cuando haya un experimento que lo pida
de verdad**. Montarlo sin caso de uso es añadir una dependencia a cambio de nada.

**Salida de fase**: el sitio tiene contenido propio y el modelo está validado en dos
de los tres niveles. A partir de aquí el proyecto es solo escribir.

---

## Fase 5 — Extras, por orden de rentabilidad

Ninguno bloquea. Se hacen cuando apetezca, y en este orden:

1. **Modo oscuro** — el toggle; los tokens ya están.
2. **RSS** (`/rss.xml`) — barato y hace el laboratorio seguible.
3. **OG images** — importa si se comparte un experimento con un cliente.
4. Playwright, si algún día hay algo que merezca una prueba de regresión visual.

---

## Deudas abiertas que arrastramos

Ninguna bloquea la Fase 2, pero conviene no perderlas:

- [ ] `docs/ref/PROCEDENCIA.md` — modelo y prompt del científico (repo público).
- [ ] Marca de terceros en las zapatillas del asset: **no subir a `public/`** hasta
      retocarlo o regenerarlo. Hoy da igual: el científico ya no está en la maqueta.
- [ ] Decidir si el científico se usa en algún sitio, o se queda en `docs/ref/`
      como origen de la paleta y nada más.
- [ ] Recorte a PNG con transparencia — **solo si** se responde lo anterior.

---

## Resumen

| Fase | Qué entrega | Esfuerzo |
|---|---|---|
| 2 | Esqueleto + tokens + deploy con una demo falsa | ~3 h |
| 3 | Generador, CodeViewer y las tres vistas reales | ~3 h |
| 4 | Dos experimentos propios | ~2 h |
| 5 | Oscuro, RSS, OG | a demanda |

El orden no es negociable en un punto: **los tokens (2.4) antes que cualquier
componente**, y **el generador (3.1) antes que el contenido**. Todo lo demás se puede
mover.
