# Estado de sesión — 2026-10-05

**Fase 3 cerrada.** Siguiente: Fase 4, los dos primeros experimentos de verdad
(`03-plan-implementacion.md`).

## Antes de empezar la Fase 4 — lo que solo puede hacer el usuario

- [ ] `git rm --cached .claude/settings.local.json`: estaba confirmado en el repo
      público. Contenido inofensivo; ya está en `.gitignore`.
- [ ] Revisar en el navegador (`pnpm dev`):
  - Aspecto de las tres vistas y en móvil.
  - Pestañas con teclado (flechas, Inicio, Fin) y foco visible.
  - Transición entre vistas en Chrome, Edge o Safari, y que desaparece con "reducir
    movimiento".
- [ ] Ver el CI en verde en la pestaña _Actions_ tras el push.
- [ ] Comprobar que `/labs/css`, `/labs/js` y `/labs/react` ya no dan 404 en producción.

## Fase 3 — qué quedó hecho

- 3.1 – 3.8 cerradas. El detalle de cada tarea y cómo quedó está en
  `05-fase-3-detalle.md` y en el historial de git.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check` y `pnpm build` pasan en limpio.
  Ni un hex fuera de `tokens.css`.
- Skills `maquetacion`, `javascript` y `nuevo-lab` y `CLAUDE.md` actualizados (`05` §9).

## Decisiones cerradas (para no reabrirlas)

1. **Storybook solo documenta tokens.** Si hace falta un catálogo de componentes, se
   monta una página `/ds` en el sitio.
2. **Organización por rol:** `src/layouts/`, `src/components/{site,lab,ui}/`,
   `src/demos/`.
3. **Un componente = una carpeta** con `.astro` + `.css`, y el CSS importado en el
   frontmatter.
4. **Anidado BEM:** bloque → elemento → estado o modificador, máximo tres niveles,
   nombres completos (`&.bloque__elemento--mod`, nunca `&__x` ni `&--x`). Está en la
   skill `maquetacion`.
5. **Las demos van en `public/demos/`**, no en `public/labs/`: chocaban en el build con
   la ficha `/labs/<cat>/<slug>`.
6. **`demoPath` apunta a `.../index.html`**, no a la carpeta: `astro dev` no resuelve el
   índice de una carpeta de `public/` y el iframe daba 404 en local.
7. **Los acentos solo en líneas y marcas, nunca como color de texto** (3:1, no 4.5:1).
8. **`z` se importa de `astro/zod`** (Zod 4). Las URL, con `z.url()`.
9. **Modo oscuro:** el atributo será `[data-theme="dark"]`.
10. **GitHub:** `https://github.com/jmocana2`. **Rojo del corazón:** `#e14b4b`.
11. **Código monocromo**: tema de Shiki con tokens; comentarios en `--color-ink-2`.
12. **Pestañas con `ui/Tabs` + `TabPanel`**; sin JS se ve el resultado, no el código.
13. **View Transitions nativas** (`@view-transition`), sin `<ClientRouter />`.
14. **`aria-current`**: `page` en el listado, `true` en la ficha.
15. **Lo que falta en build rompe el build** con la ficha y la ruta en el mensaje.

## Pendientes que se arrastran

- Añadir `superRefine` a `content.config.ts` (exigir `coverAlt` si hay `cover`) cuando
  aparezca la primera ficha con portada.
- `frameHeight` opcional en el esquema cuando una demo `iframe` no quepa en 40rem.
- La ficha `prueba` se borra en la Fase 4, con el primer experimento real.
- Mejoras de la Fase 5 en `03` (modo oscuro, que el CI bloquee el despliegue, RSS, OG,
  `island`, Playwright).

## Preguntas abiertas

- **Móvil:** ancho máximo de página por encima de 1200.
- **`<head>`:** patrón del `<title>`, favicon, `theme-color` y qué fuente se precarga.
