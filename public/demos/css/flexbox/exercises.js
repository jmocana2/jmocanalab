/*
 * exercises.js — los diez ejercicios: enunciado, cajas, CSS fijo de la escena, solución
 * y explicación. Va aparte del index.html para que la pestaña Código no destripe las
 * soluciones; no está en `sources`.
 *
 * Cada caja lleva la clase `box` y, si la tiene, la suya propia (`className`). `scene` se
 * aplica igual al objetivo y a tu resultado; `solution` solo al objetivo.
 */

/** Ejercicios en orden. `measure` pinta el ancho de cada caja: los de reparto de espacio. */
const EXERCISES = [
  {
    id: 'bookshelf',
    title: 'La estantería',
    prompt:
      'Los libros están apilados unos encima de otros. Ponlos en fila, de izquierda a derecha, con 0.8rem de separación entre cada uno.',
    boxes: [
      { label: 'A', className: 'book' },
      { label: 'B', className: 'book' },
      { label: 'C', className: 'book' },
      { label: 'D', className: 'book' },
      { label: 'E', className: 'book' },
    ],
    scene: `
      .book { width: 3.2rem; }
      .book:nth-child(1) { height: 10rem; }
      .book:nth-child(2) { height: 12rem; }
      .book:nth-child(3) { height: 8rem; }
      .book:nth-child(4) { height: 13rem; }
      .book:nth-child(5) { height: 11rem; }
    `,
    starter: '.stage {\n  \n}\n',
    solution: `.stage {
  display: flex;
  gap: 0.8rem;
}`,
    explanation:
      'display: flex convierte .stage en contenedor flexible y a sus hijos en elementos flexibles, que se colocan a lo largo del eje principal: por defecto, en fila (flex-direction: row). gap separa los elementos sin tocar sus márgenes.',
    measure: false,
  },
  {
    id: 'traffic-light',
    title: 'El semáforo',
    prompt:
      'Monta el semáforo: las tres luces en columna, con 0.8rem entre ellas, y el conjunto en el centro exacto del recuadro, en horizontal y en vertical.',
    boxes: [
      { label: '1', className: 'light' },
      { label: '2', className: 'light' },
      { label: '3', className: 'light' },
    ],
    scene: `
      .light { width: 4rem; height: 4rem; border-radius: 50%; }
    `,
    starter: '.stage {\n  \n}\n',
    solution: `.stage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
}`,
    explanation:
      'Con flex-direction: column el eje principal pasa a ser el vertical. Por eso justify-content, que trabaja en el eje principal, centra en vertical, y align-items, en el eje cruzado, centra en horizontal: al girar el eje se giran también los papeles.',
    measure: false,
  },
  {
    id: 'parking',
    title: 'El aparcamiento',
    prompt:
      'Aparca los cuatro coches en una fila centrada en vertical, con exactamente el mismo hueco entre coche y coche que entre los coches de los extremos y el borde.',
    boxes: [
      { label: '1', className: 'car' },
      { label: '2', className: 'car' },
      { label: '3', className: 'car' },
      { label: '4', className: 'car' },
    ],
    scene: `
      .car { width: 5rem; height: 3rem; }
    `,
    starter: '.stage {\n  \n}\n',
    solution: `.stage {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}`,
    explanation:
      'space-between deja los extremos pegados al borde; space-around pone en los extremos la mitad del hueco interior; space-evenly reparte huecos idénticos en todas partes, bordes incluidos. align-items: center centra la fila en el eje cruzado.',
    measure: false,
  },
  {
    id: 'skyline',
    title: 'El skyline',
    prompt:
      'Levanta el skyline: los edificios en fila, con 0.4rem de separación y apoyados en el suelo. La grúa (.crane) es la excepción: cuelga del techo.',
    boxes: [
      { label: '1', className: 'building' },
      { label: '2', className: 'building' },
      { label: '3', className: 'crane' },
      { label: '4', className: 'building' },
      { label: '5', className: 'building' },
    ],
    scene: `
      .building { width: 5rem; }
      .building:nth-child(1) { height: 8rem; }
      .building:nth-child(2) { height: 12rem; }
      .building:nth-child(4) { height: 6rem; }
      .building:nth-child(5) { height: 14rem; }
      .crane { width: 1.6rem; height: 6rem; }
    `,
    starter: '.stage {\n  \n}\n\n.crane {\n  \n}\n',
    solution: `.stage {
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
}

.crane {
  align-self: flex-start;
}`,
    explanation:
      'align-items alinea a todos los hijos en el eje cruzado; flex-end los lleva al final, que en una fila es abajo. align-self hace lo mismo para un solo hijo y manda sobre el align-items del contenedor.',
    measure: false,
  },
  {
    id: 'bus-queue',
    title: 'La cola del autobús',
    prompt:
      'La parada está a la derecha del todo. Forma la cola hacia allí, con 0.8rem entre pasajeros: el más cercano a la parada es el 3 (.senior), que tiene preferencia; detrás, el 1, el 2, el 4 y el 5. Sin tocar el HTML.',
    boxes: [
      { label: '1', className: 'person' },
      { label: '2', className: 'person' },
      { label: '3', className: 'person senior' },
      { label: '4', className: 'person' },
      { label: '5', className: 'person' },
    ],
    scene: `
      .person { width: 4rem; height: 6rem; }
    `,
    starter: '.stage {\n  \n}\n\n.senior {\n  \n}\n',
    solution: `.stage {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
}

.senior {
  order: -1;
}`,
    explanation:
      'row-reverse invierte el eje principal: el inicio pasa a la derecha y los hijos se colocan desde ahí. order cambia el orden visual sin tocar el DOM: todos valen 0, así que -1 pasa por delante. Ojo: el orden de lectura y de tabulación sigue siendo el del HTML.',
    measure: false,
  },
  {
    id: 'tetris',
    title: 'El tetris',
    prompt:
      'Coloca las piezas en fila, con 0.4rem de separación en las dos direcciones. Las que no quepan bajan a la línea siguiente sin encogerse, y el bloque entero de líneas descansa en el suelo del recuadro.',
    boxes: [
      { label: '1', className: 'piece' },
      { label: '2', className: 'piece' },
      { label: '3', className: 'piece' },
      { label: '4', className: 'piece' },
      { label: '5', className: 'piece' },
      { label: '6', className: 'piece' },
      { label: '7', className: 'piece' },
    ],
    scene: `
      .piece { height: 3rem; }
      .piece:nth-child(1) { width: 10rem; }
      .piece:nth-child(2) { width: 8rem; }
      .piece:nth-child(3) { width: 12rem; }
      .piece:nth-child(4) { width: 6rem; }
      .piece:nth-child(5) { width: 9rem; }
      .piece:nth-child(6) { width: 11rem; }
      .piece:nth-child(7) { width: 7rem; }
    `,
    starter: '.stage {\n  \n}\n',
    solution: `.stage {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  gap: 0.4rem;
}`,
    explanation:
      'Sin flex-wrap, flexbox mete todo en una sola línea y encoge las piezas para que quepan. Con wrap, las que no caben saltan a otra línea. align-content reparte las líneas en el eje cruzado (solo tiene efecto si hay varias) y flex-end las lleva abajo; align-items, en cambio, alinea los elementos dentro de cada línea.',
    measure: false,
  },
  {
    id: 'scale',
    title: 'La báscula',
    prompt:
      'El contenedor ya es flex y las tres cajas miden 4rem por su width. Haz que las tres partan de 8rem sin tocar width, y que solo la B se quede con todo el espacio libre.',
    boxes: [
      { label: 'A', className: 'a' },
      { label: 'B', className: 'b' },
      { label: 'C', className: 'c' },
    ],
    scene: `
      .stage { display: flex; }
      .box { width: 4rem; }
    `,
    starter: '.box {\n  \n}\n\n.b {\n  \n}\n',
    solution: `.box {
  flex-basis: 8rem;
}

.b {
  flex-grow: 1;
}`,
    explanation:
      'flex-basis es el tamaño de partida en el eje principal y, si no vale auto, manda sobre width. Las tres parten de 8rem: 24rem de los 32rem del contenedor. Sobran 8rem y solo B tiene flex-grow, así que se los queda todos: A 8rem, B 16rem y C 8rem.',
    measure: true,
  },
  {
    id: 'accordion',
    title: 'El acordeón',
    prompt:
      'Los fuelles ya tienen un ancho cada uno: 6rem, 2rem y 4rem. Haz que llenen el contenedor en proporción exacta 1 : 2 : 1, es decir, 8rem, 16rem y 8rem. Prueba primero solo con flex-grow.',
    boxes: [
      { label: 'A', className: 'a' },
      { label: 'B', className: 'b' },
      { label: 'C', className: 'c' },
    ],
    scene: `
      .stage { display: flex; }
      .a { width: 6rem; }
      .b { width: 2rem; }
      .c { width: 4rem; }
    `,
    starter: '.a {\n  \n}\n\n.b {\n  \n}\n\n.c {\n  \n}\n',
    solution: `.a,
.c {
  flex: 1;
}

.b {
  flex: 2;
}`,
    explanation:
      'flex-grow no reparte el contenedor: reparte lo que sobra. Con flex-basis: auto cada fuelle parte de su width (12rem en total); sobran 20rem, en partes de 5 + 10 + 5, y salen 11, 12 y 9rem. Con flex-basis: 0 todos parten de cero, sobra el contenedor entero y la proporción sale exacta: 8, 16 y 8. Es justo lo que hace flex: 1, que equivale a 1 1 0%.',
    measure: true,
  },
  {
    id: 'press',
    title: 'La prensa',
    prompt:
      'Las cajas suman 38rem y el contenedor mide 32rem: flexbox tiene que quitar 6rem. Haz que la A no encoja nada y que la C encoja el doble que la B.',
    boxes: [
      { label: 'A', className: 'a' },
      { label: 'B', className: 'b' },
      { label: 'C', className: 'c' },
    ],
    scene: `
      .stage { display: flex; }
      .a { width: 8rem; }
      .b, .c { width: 15rem; }
    `,
    starter: '.a {\n  \n}\n\n.b {\n  \n}\n\n.c {\n  \n}\n',
    solution: `.a {
  flex-shrink: 0;
}

.c {
  flex-shrink: 2;
}`,
    explanation:
      'flex-shrink reparte lo que falta, ponderado por el tamaño de partida: cada caja encoge en proporción a flex-shrink × flex-basis. Con todo a 1, hasta la A encoge un poco (8/38 de los 6rem). Con A a 0, B (1 × 15) y C (2 × 15) se reparten los 6rem en 1 : 2: B pierde 2rem y C 4rem. Quedan 8, 13 y 11rem.',
    measure: true,
  },
  {
    id: 'navbar',
    title: 'La barra de navegación',
    prompt:
      'Solo con el atajo flex: el logo, rígido, ni crece ni encoge; el botón mide siempre 12rem; el buscador se queda con todo lo que sobra, aunque su width diga 30rem.',
    boxes: [
      { label: 'Logo', className: 'logo' },
      { label: 'Buscar', className: 'search' },
      { label: 'Entrar', className: 'button' },
    ],
    scene: `
      .stage { display: flex; align-items: center; gap: 1rem; }
      .box { height: 4rem; }
      .logo { width: 6rem; }
      .search { width: 30rem; }
      .button { width: 8rem; }
    `,
    starter: '.logo {\n  \n}\n\n.search {\n  \n}\n\n.button {\n  \n}\n',
    solution: `.logo {
  flex: none;
}

.search {
  flex: 1;
}

.button {
  flex: 0 0 12rem;
}`,
    explanation:
      'El orden del atajo es siempre crecer, encoger y tamaño de partida. flex: none es 0 0 auto: rígido, con su tamaño natural. flex: 0 0 12rem no crece, no encoge y parte de 12rem. flex: 1 es 1 1 0%: parte de cero, su width deja de contar y crece hasta los 12rem que sobran (32 − 6 − 12 − 2 de los dos gaps). Con flex: auto partiría de 30rem y llegaría a 12 encogiendo: aquí coincide el resultado, no el camino.',
    measure: true,
  },
];
