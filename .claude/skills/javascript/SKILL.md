---
name: javascript
description: Convenciones de JavaScript y TypeScript de jmocanalab — sin barrels, estructura de componente por responsabilidad (containers/UI/utils/constants/types), JSDoc solo en funciones y configuración, sin ternarios anidados y sin switch. Úsala al escribir o modificar cualquier `.ts`, `.js`, `.tsx`, script del proyecto o demo de JS.
---

# JavaScript y TypeScript

Convenciones **de este proyecto**. TypeScript en `strict`.

Principio que gobierna todo lo demás: **ante la duda, quitar.**

---

## Idioma

| Qué | Idioma |
|---|---|
| Nombres de fichero y de carpeta | **inglés**, en `kebab-case` (los componentes, en `PascalCase`) |
| Identificadores: variables, funciones, tipos, propiedades, constantes | **inglés** |
| Comentarios y JSDoc | **español** |
| Cadenas de texto que ve el usuario | **español** |
| Mensajes de commit | **español** |

**Se escribe en inglés lo que lee la máquina y en español lo que lee una persona.**

```ts
/** Altura por defecto del iframe de demo, en rem. La sobrescribe `height` del frontmatter. */
export const DEFAULT_DEMO_HEIGHT = 40;
```

Ojo con el caso híbrido: una constante cuyo **valor** es texto de interfaz va con el
nombre en inglés y el valor en español.

```ts
const STATUS_LABEL = { done: 'Terminado', wip: 'En curso', idea: 'Idea' } as const;
```

---

## Estructura de un componente

Cada componente separa sus responsabilidades en ficheros:

| Fichero | Qué contiene |
|---|---|
| `containers/` | La **lógica**: obtener datos, derivarlos, decidir. Sin marcado. |
| `UI/` | La **presentación**: recibe datos ya resueltos y los pinta. Sin lógica de negocio. |
| `utils/` | Funciones **puras** y reutilizables. Sin estado, sin efectos. |
| `constants/` | Valores fijos y configuración. |
| `types.ts` | Tipos e interfaces. |

Las carpetas conservan estos nombres tal cual —están en inglés— y los ficheros dentro
también: `highlight.ts`, no `resaltar.ts`.

**Dónde vive cada cosa**: si solo lo usa un componente, dentro de la carpeta de ese
componente. Cuando lo necesita un segundo, **se sube a la carpeta común de `src/`**
(`src/utils/`, `src/constants/`, `src/types.ts`) y no antes.

```
src/
├── utils/                      # comunes: los usa más de un componente
├── constants/
├── types.ts
└── components/
    └── code-viewer/
        ├── containers/CodeViewer.astro
        ├── UI/Tabs.astro
        ├── utils/highlight.ts
        ├── constants/index.ts
        └── types.ts
```

Subir algo a común es una decisión consciente: hace crecer la superficie compartida del
proyecto. Bajar algo de común a un componente, cuando resulta que solo lo usa uno, es
igual de válido.

## Nada de barrels

**Sin ficheros `index.ts` que reexportan.** Cada import apunta al fichero real:

```ts
// ✅
import { highlight } from '../utils/highlight';

// ❌
import { highlight } from '../utils';
```

Por qué: rompen el tree-shaking, crean ciclos de importación difíciles de ver, hacen el
build más lento y esconden de dónde viene cada cosa. Un `constants/index.ts` que **define**
las constantes no es un barrel —es un fichero con contenido— y está bien; lo prohibido es
el fichero cuyo único cuerpo son `export * from …`.

## Comentarios

**JSDoc solo en dos sitios:**

1. **Funciones** — qué hace, qué recibe, qué devuelve.
2. **Variables de configuración** — qué significa el valor y qué pasa si se cambia.

```ts
/**
 * Calcula el número de orden de un experimento dentro de su categoría.
 * @param labs Experimentos de la categoría, ya ordenados por fecha.
 * @param slug Identificador del experimento buscado.
 * @returns El número formateado a tres dígitos («007»), o «000» si no aparece.
 */
export function orderNumber(labs: Lab[], slug: string): string { /* … */ }

/** Altura por defecto del iframe de demo, en rem. La sobrescribe `height` del frontmatter. */
export const DEFAULT_DEMO_HEIGHT = 40;
```

En ningún otro sitio: ni comentarios sueltos dentro de las funciones, ni cabeceras de
sección, ni `// TODO` que sobreviven al commit. Si un bloque necesita explicación, se
extrae a una función con un nombre que la dé.

Con TypeScript, **no se repiten los tipos en el JSDoc** (`@param {string}`): el tipo está
en la firma y duplicarlo garantiza que se desincronice.

## Sin ternarios anidados

Un ternario, y solo si cabe en una línea y se lee de un vistazo. En cuanto hay un segundo,
se convierte en `if` con salida temprana o en una función con nombre.

```ts
// ❌
const label = status === 'done' ? 'Terminado' : status === 'wip' ? 'En curso' : 'Idea';

// ✅
const STATUS_LABEL = {
  done: 'Terminado',
  wip:  'En curso',
  idea: 'Idea',
} as const satisfies Record<Status, string>;

const label = STATUS_LABEL[status];
```

## Sin switch

Se sustituye por un objeto de consulta, como el ejemplo de arriba. Ventajas concretas
aquí: `satisfies Record<Status, …>` obliga a cubrir todos los casos en tiempo de
compilación —el día que se añada una categoría, TypeScript señala el objeto incompleto—,
no hay `break` que olvidar, y el objeto se puede extraer a `constants/` y reutilizar.

Si las ramas son comportamiento y no valores, el objeto guarda funciones. Si además hace
falta un caso por defecto, `?? POR_DEFECTO` y listo.

## TypeScript

- `strict`, y sin `any`. Si un tipo no se conoce, `unknown` y se estrecha.
- **Sin aserciones `as`** salvo `as const`. Un `as` es decirle al compilador que se calle.
- Los tipos del contenido salen de las content collections de Astro
  (`CollectionEntry<'labs'>`), no se reescriben a mano.
- `type` por defecto; `interface` solo cuando se necesite extender o fusionar.
- Exportaciones **nombradas**. Sin `export default`, salvo donde lo exija una herramienta.

## JavaScript en el sitio

El sitio es estático y casi sin JS del lado del cliente. Antes de añadir una línea que
llegue al navegador, comprobar que no se resuelve en build o con CSS. El presupuesto de JS
es parte del diseño.

Las demos de `public/labs/` son la excepción: ahí el JS es el contenido. Van en ficheros
sueltos, sin build, sin dependencias, y **deben abrirse solas en el navegador** con doble
clic. Esa portabilidad es el motivo de que el nivel `iframe` exista.

## Checklist antes de dar algo por bueno

- [ ] Ficheros, carpetas e identificadores en inglés; comentarios y texto visible en
      español.
- [ ] Ningún barrel; los imports apuntan al fichero real.
- [ ] Lógica, UI, utils, constantes y tipos, cada cosa en su sitio.
- [ ] Lo específico vive en el componente; solo sube a común lo que usa más de uno.
- [ ] JSDoc en funciones y en configuración; en ningún otro sitio.
- [ ] Ni un ternario anidado, ni un `switch`.
- [ ] Sin `any`, sin `as` (salvo `as const`), sin `export default`.
- [ ] Nada de JS al cliente que se pudiera haber resuelto en build o con CSS.
