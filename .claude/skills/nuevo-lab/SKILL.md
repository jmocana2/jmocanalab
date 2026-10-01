---
name: nuevo-lab
description: Crea un experimento nuevo en jmocanalab con el generador `pnpm new:lab` — ficha en `src/content/labs/` y esqueleto de demo (`iframe` o `inline`). Úsala siempre que haya que añadir un experimento, ejercicio, demo o lab; nunca se crean a mano.
---

# Nuevo experimento

**Un experimento se crea solo con `pnpm new:lab`.** Nunca a mano: ni la ficha, ni la
carpeta de la demo, ni el componente. El generador fija las rutas de `entry` y `sources`,
la fecha y el estado inicial; a mano, a la quinta ficha hay cinco convenciones.

## Los cuatro datos

| Argumento    | Qué es                                            | Ejemplo                 |
| ------------ | ------------------------------------------------- | ----------------------- |
| `--category` | `css`, `js` o `react`                             | `css`                   |
| `--title`    | Título visible, **en español**                    | `'Holy grail con Grid'` |
| `--slug`     | URL, **en inglés**, kebab-case, empieza por letra | `holy-grail`            |
| `--runtime`  | `iframe` (aislada) o `inline` (embebida)          | `iframe`                |

El slug **no se deduce del título**: el título va en español y el slug en inglés. Si el
usuario no lo da, se le propone uno en inglés y se confirma.

`iframe` es el caso por defecto para `css` y `js`: aislamiento total y la demo se abre
sola en el navegador. `inline` solo cuando la demo tiene que convivir con la página.
`island` todavía no existe: llega con la integración de React.

## Cómo se ejecuta

Desde Claude, **siempre con los cuatro argumentos**: sin terminal interactiva, el script
no puede preguntar y falla indicando qué falta.

```
pnpm new:lab --category css --title 'Holy grail con Grid' --slug holy-grail --runtime iframe
```

El usuario puede lanzar `pnpm new:lab` sin argumentos y responder a las preguntas.

Si falta algún dato, se le pregunta al usuario **antes** de ejecutar. No se inventan
título ni categoría.

## Qué crea

| Runtime  | Ficheros                                                                            |
| -------- | ----------------------------------------------------------------------------------- |
| `iframe` | `src/content/labs/<cat>/<slug>.md` + `public/demos/<cat>/<slug>/index.html`         |
| `inline` | `src/content/labs/<cat>/<slug>.md` + `src/demos/<cat>/<Name>/<Name>.astro` y `.css` |

La ficha sale con `status: wip`, `featured: false`, `kind: exercise`, la fecha de hoy y
el `summary` vacío. **Nunca sobrescribe**: si algún fichero ya existe, no crea ninguno.

## Después de generar

1. Rellenar `summary` (máximo 180 caracteres, en español). Ajustar `kind` y `tags` si
   hace falta.
2. Escribir la demo siguiendo las skills `maquetacion` y `javascript`. En las demos
   `iframe`, todo dentro del `index.html` o en ficheros sueltos a su lado, sin build ni
   dependencias; si se añaden ficheros, se añaden también a `sources`.
3. `status: done` cuando esté terminada; `featured: true` solo si el usuario lo pide.
4. Comprobar con `pnpm build` y abrir `/labs/<cat>/<slug>`.

Línea roja de `CLAUDE.md`: nada de código, datos ni marcas de Atresmedia o Knowmad mood.
Una técnica aprendida en el trabajo se reimplementa desde cero con un ejemplo genérico.
