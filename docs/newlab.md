# Crear un experimento

Un experimento es una **ficha** (un `.md` con frontmatter) más su **demo**. Se crea solo
con el generador; a mano, nunca. El generador fija las rutas, la fecha y el estado
inicial, y así la quinta ficha sigue la misma convención que la primera.

---

## 1. El comando

```bash
pnpm new:lab
```

Pregunta lo que falte. Con los cuatro argumentos no pregunta nada:

```bash
pnpm new:lab --category css --title 'Holy grail con Grid' --slug holy-grail --runtime iframe
```

| Argumento    | Qué es                                            | Ejemplo                 |
| ------------ | ------------------------------------------------- | ----------------------- |
| `--category` | `css`, `js` o `react`                             | `css`                   |
| `--title`    | Título visible, **en español**                    | `'Holy grail con Grid'` |
| `--slug`     | URL, **en inglés**, kebab-case, empieza por letra | `holy-grail`            |
| `--runtime`  | `iframe` o `inline`                               | `iframe`                |

El slug no se deduce del título: uno va en español y el otro en inglés. **Nunca
sobrescribe**: si algún fichero ya existe, no crea ninguno.

## 2. Qué runtime elegir

| `runtime` | Dónde vive la demo                           | Cuándo                                               |
| --------- | -------------------------------------------- | ---------------------------------------------------- |
| `iframe`  | `public/demos/<cat>/<slug>/index.html`       | **Por defecto** en CSS y JS. Aislamiento total       |
| `inline`  | `src/demos/<cat>/<Name>/<Name>.astro`+`.css` | La demo tiene que convivir con la página             |
| `island`  | —                                            | Todavía no existe. Ver `TODO.md`. Hoy rompe el build |

- **`iframe`**: HTML suelto, sin build ni dependencias. Se abre solo con doble clic. No ve
  los tokens del sitio, así que declara los suyos en `:root`. No hereda el modo oscuro.
- **`inline`**: componente Astro embebido en la ficha. Usa los tokens del sitio (y por
  tanto el modo oscuro). Todo su CSS cuelga de un bloque BEM con el nombre del slug, para
  no chocar con el sitio.
- **`island`**: un componente de React hidratado en el navegador. Llegará cuando un
  experimento necesite React de verdad.

## 3. Qué crea

```
src/content/labs/<cat>/<slug>.md          la ficha
public/demos/<cat>/<slug>/index.html      demo iframe
src/demos/<cat>/<Name>/<Name>.astro       demo inline
src/demos/<cat>/<Name>/<Name>.css
```

La ficha sale así:

```yaml
---
title: 'Holy grail con Grid'
summary: ''
category: css
kind: exercise
tags: []
date: 2026-10-06
status: wip
featured: false
runtime: iframe
entry: public/demos/css/holy-grail/index.html
sources:
  - public/demos/css/holy-grail/index.html
---
```

## 4. El frontmatter

| Campo                     | Qué es                                                         |
| ------------------------- | -------------------------------------------------------------- |
| `title`                   | Título visible, en español                                     |
| `summary`                 | Resumen, máximo 180 caracteres. **El generador lo deja vacío** |
| `category`                | `css`, `js` o `react`                                          |
| `kind`                    | `exercise`, `demo` o `project`                                 |
| `tags`                    | Etiquetas libres. Salen en el listado y en la ficha            |
| `date`                    | Publicación. Decide el número (`001`…) dentro de la categoría  |
| `updated`                 | Opcional. Hoy no se pinta                                      |
| `status`                  | `idea`, `wip` o `done`                                         |
| `featured`                | `true` lo saca en Destacados, en la portada                    |
| `runtime`                 | `iframe`, `inline` o `island`                                  |
| `entry`                   | El fichero que se ejecuta. Lo rellena el generador             |
| `sources`                 | Los ficheros que se enseñan en _Código_, en ese orden          |
| `cover` / `coverAlt`      | Opcionales. Portada y su texto alternativo. Hoy no se pintan   |
| `links.repo` / `.article` | Opcionales. Enlaces externos. Hoy no se pintan                 |

Las rutas de `entry` y `sources` son relativas a la raíz del proyecto.

## 5. Después de generar

1. Rellenar `summary`; ajustar `kind` y `tags`.
2. Escribir la demo con las convenciones de las skills `maquetacion` y `javascript`. En
   una demo `iframe`, si se añaden ficheros junto al `index.html`, se añaden también a
   `sources`.
3. Si hace falta explicar algo, se escribe en el **cuerpo del `.md`**, bajo el
   frontmatter. La ficha lo pinta debajo de _Resultado / Código_; vacío, no pinta nada.
4. `status: done` al terminar. `featured: true` si va a la portada.
5. `pnpm build` y abrir `/labs/<cat>/<slug>`.

## 6. Qué pinta la ficha

- **Número**: por fecha dentro de la categoría, calculado en el build.
- **Resultado**: la demo `iframe` en su marco, o el componente `inline` en un marco igual
  pero con altura automática.
- **Código**: un bloque por cada ruta de `sources`, resaltado en el build. Con varias, una
  pestaña por fichero. Con `sources: []`, solo el resultado y sin pestañas.
- El lenguaje sale de la extensión (`html`, `css`, `js`, `ts`, `astro`); lo demás, texto
  plano. Se amplía en `src/components/lab/CodeViewer/constants/index.ts`.

## 7. Qué rompe el build

Cada error nombra la ficha. Mejor un build roto que una ficha vacía en producción.

- Una ruta de `sources` que no existe.
- `iframe` sin su `public/demos/<cat>/<slug>/index.html`.
- `inline` cuyo `entry` no es un `.astro` de `src/demos/`.
- `island`.
- Lo que valida el esquema (`src/content.config.ts`), como un `summary` de más de 180
  caracteres.

## 8. Borrar o renombrar

- **Borrar**: la ficha y la carpeta de la demo. Los números de la categoría se recalculan
  solos.
- **Renombrar el slug** cambia la URL: rompe los enlaces que ya se hayan compartido. Se
  evita.
- Una categoría nueva se añade en `src/constants/categories.ts`, con su nombre visible en
  `src/constants/labels.ts` (TypeScript lo exige) y su acento en `tokens.css`, en claro y
  en oscuro. Una existente no se renombra.

> Línea roja: nada de código, datos ni marcas de Atresmedia o Knowmad mood. Una técnica
> aprendida en el trabajo se reimplementa desde cero con un ejemplo genérico.
