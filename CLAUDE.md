# jmocanalab

Laboratorio y portfolio front-end de jmocanalab. Astro estático, desplegado en Vercel.
Un experimento = una ficha de contenido + su demo aislada. **Repo público.**

Estado: **Fase 2** — esqueleto. Todavía no hay código; lo que se cree ahora fija las
convenciones del proyecto. Ver `docs/04-fase-2-detalle.md`.

---

## 1. Línea roja

> Ningún código, captura, dato, marca o asset de Atresmedia ni de Knowmad mood entra en
> este repositorio. Las técnicas aprendidas se reimplementan desde cero con un ejemplo
> genérico.

El repositorio es público. Ante la menor duda sobre el origen de un fragmento, no entra.
`.env*` está ignorado desde el primer commit y no hay secretos en el proyecto: el sitio es
estático y no llama a ninguna API.

## 2. Skills — cuándo se usan

Son obligatorias, no orientativas. Contienen las convenciones reales del proyecto; este
fichero solo las resume.

| Skill             | Se usa al tocar                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| **`maquetacion`** | `.astro`, `.html`, `.css`, las demos de `public/demos/`, cualquier marcado o estilo |
| **`javascript`**  | `.ts`, `.js`, `.tsx`, `scripts/`, el JS de las demos                                |

Un componente con marcado y lógica las usa **las dos**.

Existe además el agente `especialista-layouts-web`, a nivel de usuario. Reparto: **el
agente hace el trabajo pesado de maquetación; la skill manda en las convenciones.** En
caso de conflicto, gana la skill.

## 3. Git — los commits los hace el usuario

**Nunca ejecutes `git commit`, `git push`, `git merge`, `git rebase` ni `git reset`.**
El trabajo se deja en el árbol de trabajo, sin preparar, y se avisa de qué ficheros se han
tocado. **Revisar y confirmar los cambios es tarea del usuario, siempre.**

Sí puedes: `git status`, `git diff`, `git log` y cualquier otra lectura.

`git add` solo si el usuario lo pide explícitamente, y aun así no se cierra con un commit.
Que el usuario apruebe un cambio de código no es una autorización para confirmarlo.

Si al terminar una tarea parece oportuno un commit, se propone el mensaje —en español— y
se deja ahí. Lo ejecuta él.

## 4. Idioma

**En inglés lo que lee la máquina, en español lo que lee una persona.**

Inglés: ficheros, carpetas, clases BEM, tokens CSS, `data-*`, variables, funciones, tipos
y slugs de URL (ASCII, sin tildes).
Español: comentarios, JSDoc, texto visible en la interfaz, `alt` / `aria-label` / `title`,
`docs/` y mensajes de commit.

Sin i18n. El sitio es solo en español.

## 5. Estilos — lo que no se negocia

Está desarrollado en la skill `maquetacion`; aquí lo que más se incumple:

- CSS moderno: custom properties, `@layer`, nesting nativo. **Sin Tailwind, sin SASS.**
- **Ni un hex, ni un tamaño, ni un espaciado literal fuera de `src/styles/tokens.css`.**
  En los componentes, solo `var(--…)`.
- **Todo en `rem`**, sobre `html { font-size: 62.5% }`. Excepciones: `1px`/`2px` de
  bordes, y las media queries.
- Mobile first con `min-width`. Dos breakpoints, 768 y 1200, y ninguno más.
- Accesibilidad **AA** como requisito de salida, no como repaso final.
- Nada de `!important`. Nada de estilos en línea salvo valores calculados.

## 6. Cómo se añade un experimento

**Hoy, a mano** (la Fase 2 no tiene generador): una ficha en `src/content/labs/<categoría>/`
y, si el `runtime` es `iframe`, su carpeta en `public/demos/<categoría>/<slug>/`.
La demo no va en `public/labs/`: chocaría en el build con la ficha `/labs/<categoría>/<slug>`.

**Desde la Fase 3, solo con `pnpm new:lab`.** Nunca a mano. ← actualizar esta línea el día
que exista el generador.

Las categorías son `css`, `js` y `react`. Añadir una es tocar el `z.enum` del esquema;
renombrarla rompe URLs, así que no se renombra.

## 7. Principio de diseño

> **Ante la duda, quitar.**

Aire, mayúsculas pequeñas con mucho tracking, monocromo con un acento mínimo. Si una
propuesta añade un elemento decorativo, la respuesta por defecto es **no**. La dirección
visual está cerrada en `docs/02-diseno.md`; no se reinterpreta al maquetar.

## 8. Entorno

pnpm · Node 22 · TypeScript `strict` · Astro con `output: 'static'`, sin adaptador.
`gh` no está instalado en esta máquina.

## 9. Documentación

El razonamiento vive en `docs/`, no aquí. Este fichero no duplica tokens, rutas ni listas
de componentes: eso se desincroniza.

| Documento                        | Qué contiene                                         |
| -------------------------------- | ---------------------------------------------------- |
| `docs/00-analisis-inicial.md`    | Análisis técnico y alternativas descartadas          |
| `docs/01-decisiones.md`          | Decisiones cerradas de la Fase 0                     |
| `docs/02-diseno.md`              | Dirección visual. **Manda en lo visual**             |
| `docs/03-plan-implementacion.md` | Plan por fases                                       |
| `docs/04-fase-2-detalle.md`      | Fase 2: tokens, Storybook y skills. **En ejecución** |

Este `CLAUDE.md` se revisa **al cerrar cada fase**. Dos señales de que hay que tocarlo:
una corrección repetida dos veces, o una convención que existe en el código y no está
escrita en ningún sitio.
