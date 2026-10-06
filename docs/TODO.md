# TODO

Lo que se ha hablado y queda pendiente. Nada de aquí bloquea el sitio: está desplegado y
funciona. Se tacha al hacerlo y se borra al cerrar el bloque.

---

## 1. Ahora

- [ ] `git rm --cached .claude/settings.local.json`. Sigue confirmado en el repo público
      aunque ya está en `.gitignore`. Contenido inofensivo, pero es configuración local.
- [ ] Revisar el modo oscuro en el navegador: las tres vistas, el código, el foco y el
      contraste del botón en los dos temas.

## 2. Primeros experimentos

Los dos primeros, que sirven de plantilla viva para el resto. Todos con `pnpm new:lab`
([newlab.md](newlab.md)).

- [ ] **CSS — Flexbox** (`iframe`). Una ficha.
- [ ] **CSS — Grid** (`iframe`). Otra ficha: holy grail, rejilla de tarjetas con
      `auto-fit` / `minmax`, `subgrid`…
- [ ] **JS — Programación orientada a objetos** (`inline`). Clases, herencia,
      composición, prototipos, `#private`, getters y setters. Valida el camino sin iframe y
      el `CodeViewer` sobre código que no se ve en pantalla.
- [ ] Borrar la ficha `prueba` (`src/content/labs/css/prueba.md` y
      `public/demos/css/prueba/`) cuando entre el primer experimento real.

## 3. Mejoras, por orden de rentabilidad

1. **Que el CI bloquee el despliegue.** Hoy Vercel publica aunque fallen lint, tipos o
   formato. Primera opción: que Vercel espere a los checks de GitHub antes de publicar en
   producción, si el panel lo permite. Si no, cambiar el comando de build de Vercel a
   `pnpm lint && pnpm typecheck && pnpm build`. Descartado: proteger `main` con PR
   obligatorio y desplegar desde Actions.
2. **RSS** (`/rss.xml`, `@astrojs/rss`) y **sitemap** (`@astrojs/sitemap`). Baratos y hacen
   el laboratorio seguible e indexable.
3. **Imágenes OG** (Satori o `astro-og-canvas`). Importan cuando se comparte un
   experimento por LinkedIn o con un cliente.
4. **Nivel `island` (React).** Ver §4.
5. **Playwright**: un smoke test que recorra todas las fichas y falle si alguna revienta.
   Útil a partir de unos 20 experimentos.

## 4. El nivel `island`, para cuando llegue

Es el tercer `runtime`: la demo es un **componente de React que se hidrata en el
navegador** (`client:visible`) dentro de la ficha. Sirve para experimentos que necesitan
un framework de verdad: estado, efectos, hooks, una librería de React. Los niveles
`iframe` e `inline` no lo cubren porque no ejecutan React.

Hoy el esquema lo admite y el build falla con un aviso si una ficha lo usa. Para activarlo:

- `@astrojs/react` y React como dependencias. Solo React: nada de coleccionar
  integraciones por si acaso.
- Una entrada `island` en `resolve-demo.ts` y en el generador (`DEMO_FILES`).
- Ampliar `LANGUAGE_BY_EXTENSION` con `jsx` y `tsx`.
- Revisar la skill `javascript` para los `.tsx`.

**Se hace cuando un experimento lo pida.** Montarlo sin caso de uso es añadir una
dependencia a cambio de nada.

## 5. Pendientes técnicos pequeños

- [ ] `frameHeight` opcional en el esquema, cuando una demo `iframe` no quepa en 40rem.
- [ ] `superRefine` en `content.config.ts` que exija `coverAlt` si hay `cover`, cuando
      aparezca la primera ficha con portada.
- [ ] Pintar `updated`, `links` y `cover` en la ficha, si llegan a usarse.
- [ ] `<meta name="theme-color">` para claro y oscuro, si hace falta en móvil.
- [ ] `description` propia en el listado y en la ficha (hoy solo la tiene la portada; la
      ficha podría usar el `summary`).
- [ ] Modo oscuro en las demos `iframe`: hoy no lo heredan. Opción barata: que cada demo
      declare sus colores también bajo `prefers-color-scheme: dark`.
- [ ] Revisar el pin de TypeScript 6 cuando `typescript-eslint` soporte TS 7 (issue 10940
      de su repo).

## 6. Ideas, sin fecha

- **Vitest para la categoría `js`**: ejercicios como katas con tests.
- Página `/sobre-mi`, algo más larga que la cabecera, para dar contexto a un cliente.
- Búsqueda en cliente con Pagefind.
- Analítica ligera (Vercel Analytics o Umami).
- Lighthouse CI con presupuestos de rendimiento.
- Página `/ds` con los componentes reales, si Storybook se queda corto.
- **Categoría `ia`**: fuera de alcance. Si llega, antes de escribir nada: una demo de IA
  necesita una API key, que no puede ir en el cliente. Empezar por una demo grabada
  (respuestas guardadas en JSON); si tiene que ser interactiva, rate limit, `max_tokens`
  bajo y tope de gasto.
