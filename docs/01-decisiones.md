# jmocanalab — Decisiones cerradas (Fase 0)

> Fecha: 2026-09-09 · Estado: **cerrado**. Responde a la sección 8 de [00-analisis-inicial.md](00-analisis-inicial.md).
> Cambiar algo de aquí implica revisar el análisis inicial.

---

## 1. Identidad y datos públicos

| Campo                    | Valor                                                   |
| ------------------------ | ------------------------------------------------------- |
| Nombre público del sitio | **jmocanalab**                                          |
| LinkedIn                 | `https://www.linkedin.com/in/jmocanalab`                |
| GitHub                   | `https://github.com/jmocana2`                           |
| Email público            | **no se publica** (ni ofuscado) — contacto vía LinkedIn |

✅ **Resuelto (2026-09-09)**: el usuario ha personalizado la URL de LinkedIn a
`jmocanalab`. Solo ASCII, sin tildes ni `ñ` — nada que escapar, y además coincide con el
nombre del sitio y con el handle de GitHub. Buena señal de marca coherente.

## 2. Idioma

**Solo español. Sin i18n.** No se instala `astro:i18n` ni se prefijan rutas con `/es/`.
Reconsiderar solo si aparece un cliente internacional real.

## 3. Categorías iniciales

```
css · js · react
```

Tres, no cinco. `ia` y `herramientas` **se descartan de momento** (ver punto 6) y se añaden
al `z.enum` el día que exista el primer experimento de esa categoría — añadir es trivial,
renombrar no.

Estructura de navegación confirmada: **categoría → ejercicio**.
`/labs/css` → listado · `/labs/css/grid-holy-grail` → ficha.

## 4. Estilos

**CSS moderno con tokens.** Custom properties, `@layer`, nesting nativo.
**Tailwind descartado.** SASS descartado (no aporta sobre CSS moderno aquí).

Consecuencia directa: los tokens de color/tipografía que salgan de la fase de diseño son
el contrato de estilos del sitio, y el modo oscuro es casi gratis. Esto refuerza la
recomendación 5.1 del análisis.

## 5. Dominio

**`jmocanalab.vercel.app`** (gratuito). Sin dominio propio por ahora.
Nota: si algún día se compra dominio, migrar es indoloro _siempre que_ las rutas internas
sean relativas y no se hardcodee el host (solo en `astro.config.mjs` → `site`).

## 6. Primeros experimentos

Los dos frentes con los que se valida el modelo de contenido:

- **JS — Programación Orientada a Objetos**: clases, herencia, composición, prototipos,
  `#private`, getters/setters. Encaja con el runtime `inline` o con katas + Vitest.
- **CSS — Flexbox y Grid layout**: los clásicos (holy grail, card grid responsive,
  centrado, `subgrid`, `auto-fit/minmax`). Encaja con el runtime `iframe` (nivel B).

Sirven además como plantilla viva: uno por cada nivel de aislamiento realista al principio.

## 7. Perfil (texto de referencia para el hero)

- **jmocanalab** — Front-end developer
- Stack destacado: **CSS · JS · React**
- Técnico en Desarrollo de Aplicaciones Informáticas
- Máster en Desarrollo de Aplicaciones con IA
- **Más de 20 años de experiencia**

> El texto final del hero se pule en la fase de diseño; esto es el contenido, no la redacción.

## 8. Imagen del "científico loco"

✅ **Entregada (2026-09-10)**: `docs/ref/cientifico.jpg` (1024×1024, fondo blanco).

Qué es: render 3D estilo caricatura de un desarrollador con gorra **CSS**, sudadera con
logos de **React**, sosteniendo una placa de Petri con `box-shadow` y rodeado de matraces y
frascos flotantes que contienen fragmentos de código con luz de neón (verde, magenta,
ámbar, cian). Traduce literalmente la metáfora "laboratorio front-end": **CSS · JS · React**
son los tres reactivos, que es exactamente el punto 3.

Consecuencias para el diseño:

- **Recortable**: el fondo es blanco plano, así que sale limpio como PNG con transparencia.
  Acción en Fase 1: generar `public/img/cientifico.png` recortado; el JPG se queda en
  `docs/ref/` como original.
- Los **matraces de neón** dan una paleta de acento gratis (verde/magenta/ámbar/cian) que se
  puede reutilizar como **color por categoría** en las tarjetas de `/labs`. Con la decisión 4
  (tokens CSS) esto es una custom property por categoría y poco más.
- Encaja con el punto 12: la figura es el **único elemento de color** sobre un fondo neutro.

⚠️ **A revisar antes de publicar** (el repo es público, decisión 10): las zapatillas llevan
un texto que imita la marca **Nike** (`<nike />`). Es un logotipo de terceros en un asset de
marca propia. Recomendación: regenerar sin marca o retocar ese detalle antes de subirlo a
`public/`. No bloquea la Fase 1 (el diseño se puede montar con el JPG actual).

Sigue pendiente `docs/ref/PROCEDENCIA.md` con el modelo y el prompt usados (punto 4.8 del
análisis). Es un asset generado por IA en un repo público: conviene dejarlo escrito.

## 9. Categoría `ia`

**Fuera del alcance inicial.** No se lanza con IA.

Esto **elimina hoy el riesgo 4.2 del análisis** (API key + factura): sin endpoint, no hay
superficie de ataque. Se mantiene `output: 'static'` sin adaptador de Vercel, tal y como
recomendaba 3.2. Cuando llegue el momento, se revisa 4.2 antes de escribir una sola línea.

## 10. Visibilidad del repositorio

**Público.**

Consecuencia: la regla 4.1 del análisis pasa de recomendación a **norma dura**, y va en el
`CLAUDE.md` del proyecto:

> Ningún código, captura, dato, marca o asset de Atresmedia ni de Knowmad mood entra en
> este repositorio. Las técnicas aprendidas se reimplementan desde cero con un ejemplo
> genérico.

Añadir además: `.gitignore` con `.env*` desde el primer commit.

## 11. Demos embebidas

**No.** Basta con **código estático + resultado**.
Sin StackBlitz ni CodeSandbox. El `CodeViewer` con Shiki (pestañas _Resultado / Código_)
cubre el caso completo. Menos dependencias, menos fricción, carga más rápida.

## 12. Dirección estética

✅ **Resuelta (2026-09-10)**. El pin de Pinterest queda sustituido por
`docs/ref/UI Design - Maxim Nilov.jpg`, que sí he podido leer.

Qué muestra: una landing editorial minimalista. Fondo **blanco roto** casi vacío, una
inicial tipográfica **gigante** ("S") como elemento gráfico principal, una fotografía de
salamandra recortada sobre el mismo blanco, y **todo el texto en negro, mayúsculas,
tamaño pequeño y muy espaciado** (`letter-spacing` amplio). Un único acento de color: el
**amarillo** de la salamandra. Navegación en una línea inferior, con un paginador
`< 01  02  03 >` centrado y un número de índice (`014`) en la esquina.

**Principios que se adoptan como dirección visual del sitio:**

1. **Aire por encima de todo.** Márgenes generosos, poca densidad. El vacío es el layout.
2. **Contraste extremo de escala tipográfica**: un titular enorme frente a UI diminuta en
   mayúsculas con tracking amplio. Nada de tamaños intermedios.
3. **Monocromo + un acento.** Blanco roto de fondo, negro para el texto, y el color solo
   donde aporta información (categoría, estado activo, hover).
4. **La imagen recortada es el color.** Igual que la salamandra ahí, aquí el científico:
   sin caja, sin marco, flotando sobre el fondo.
5. **Navegación en una línea horizontal subrayada** — encaja de forma natural con la
   estructura _categoría → ejercicio_ del punto 3: `CSS · JS · REACT` como esa fila.
6. **Numeración visible** (`014`): se reutiliza como índice de experimento en las fichas y
   los listados. Da sensación de "colección" sin coste de implementación.

**Tensión a resolver, y cómo se resuelve:** la referencia es monocroma con un solo acento;
el científico aporta cuatro neones. Decisión: **el color de acento vive en la ilustración y
en la categoría activa, no en la interfaz general**. Cada categoría toma uno de los neones
del asset como su token; el resto del sitio permanece en blanco y negro.

**Sobre el modo oscuro**: la referencia es luminosa y ese es el modo por defecto. El oscuro
sale gratis por la decisión 4 (tokens), pero **no bloquea el lanzamiento**.

Intención declarada, que sigue en pie: **algo muy sencillo, cuya función principal sea
dividir por categorías y, dentro de cada una, listar ejercicios y desarrollos.** La
referencia la confirma en lugar de contradecirla.

---

## Impacto en el plan

Lo que estas decisiones **simplifican** respecto al análisis inicial:

- Sin IA → sin adaptador, sin serverless, sin gestión de secretos. Fase 2 más corta.
- Sin i18n, sin Tailwind, sin SASS, sin embeds → menos dependencias y menos configuración.
- 3 categorías en vez de 5 → menos páginas de índice al arrancar.
- La dirección estética elegida es **de bajo coste técnico**: tipografía, espacio y un
  acento. No hay ilustración por página, ni animación compleja, ni sistema de imágenes que
  mantener. Encaja con la prioridad de fricción cero por experimento.

Lo que **sigue siendo crítico** (no cambia):

- El generador `pnpm new:lab` (fricción cero por experimento).
- El nivel de aislamiento `iframe` desde el día 1 (los ejercicios de Flex/Grid lo exigen).
- El `CodeViewer` con Shiki: sin ver el código, esto es una galería, no un laboratorio.
- El contraste: mucho tracking + tamaño pequeño + gris es la trampa clásica de este estilo.
  El texto de UI se mantiene en negro sobre blanco roto, no en gris.

## Siguiente paso

> ▶ **Continúa en [02-diseno.md](02-diseno.md)** (2026-09-10): la Fase 1 arrancó y la base
> visual está aprobada. Ojo: el punto 12 de abajo describe la referencia, pero varios de sus
> gestos (imagen del científico en la maqueta, inicial tipográfica gigante) **se retiraron**
> durante el diseño. `02-diseno.md` manda sobre este documento en lo visual.

**Fase 1 — Dirección visual. Desbloqueada** (2026-09-10): los dos recursos que faltaban ya
están en `docs/ref/`.

Pendientes menores, que **no bloquean**:

- `docs/ref/PROCEDENCIA.md` (modelo + prompt del científico).
- Recorte a PNG con transparencia en `public/img/cientifico.png`.
- Retocar o regenerar el detalle de marca en las zapatillas.

Acción inmediata: `/design` con 3 artboards — **home**, **índice de categoría** y **ficha de
experimento** — aplicando los 6 principios del punto 12.
