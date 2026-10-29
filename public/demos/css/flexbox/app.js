/*
 * app.js — mecánica de los ejercicios: pinta el activo, aplica tu CSS sobre el resultado,
 * compara la posición y el tamaño de cada caja con el objetivo y guarda el progreso en el
 * navegador. Vale cualquier CSS que deje las cajas donde el objetivo, no solo la solución.
 */

/** Clave del progreso en localStorage. Cambiarla deja a todo el mundo a cero. */
const STORAGE_KEY = 'jmocanalab:flexbox';

/** Diferencia máxima, en px, entre una caja tuya y la del objetivo para darla por buena. */
const TOLERANCE = 1;

const ui = {
  steps: document.querySelector('[data-steps]'),
  progress: document.querySelector('[data-progress]'),
  number: document.querySelector('[data-number]'),
  title: document.querySelector('[data-title]'),
  prompt: document.querySelector('[data-prompt]'),
  markup: document.querySelector('[data-markup]'),
  input: document.querySelector('[data-input]'),
  status: document.querySelector('[data-status]'),
  next: document.querySelector('[data-next]'),
  reset: document.querySelector('[data-reset]'),
  finale: document.querySelector('[data-finale]'),
  solution: document.querySelector('[data-solution]'),
  solutionCode: document.querySelector('[data-solution-code]'),
  explanation: document.querySelector('[data-explanation]'),
  sceneCss: document.querySelector('[data-scene]'),
  targetCss: document.querySelector('[data-target-css]'),
  resultCss: document.querySelector('[data-result-css]'),
  target: document.querySelector('[data-scope="target"]'),
  result: document.querySelector('[data-scope="result"]'),
};

let state = loadState();

/**
 * Crea el progreso de alguien que no ha empezado.
 * @returns Primer ejercicio activo, ninguno conseguido y sin borradores.
 */
function emptyState() {
  return { current: 0, done: [], drafts: {} };
}

/**
 * Lee el progreso guardado. Si no hay, está corrupto o el navegador bloquea el
 * almacenamiento, empieza de cero.
 * @returns El progreso.
 */
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const isValid = saved && Number.isInteger(saved.current) && Array.isArray(saved.done);

    if (!isValid || !EXERCISES[saved.current]) {
      return emptyState();
    }

    return { current: saved.current, done: saved.done, drafts: saved.drafts ?? {} };
  } catch {
    return emptyState();
  }
}

/** Guarda el progreso. Si el navegador no deja, se pierde al recargar y nada más. */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/**
 * Formatea el número de un ejercicio a dos dígitos.
 * @param index Posición del ejercicio, desde 0.
 * @returns «01», «02»…
 */
function formatNumber(index) {
  return String(index + 1).padStart(2, '0');
}

/**
 * Escribe el HTML de la escena tal y como lo ve quien hace el ejercicio.
 * @param exercise Ejercicio.
 * @returns El marcado de .stage y sus cajas, como texto.
 */
function sceneMarkup(exercise) {
  const boxes = exercise.boxes.map(
    (box) => `  <div class="box ${box.className}">${box.label}</div>`,
  );

  return ['<div class="stage">', ...boxes, '</div>'].join('\n');
}

/**
 * Pinta las cajas de un ejercicio dentro de una escena.
 * @param scope Contenedor del objetivo o del resultado.
 * @param exercise Ejercicio.
 */
function renderBoxes(scope, exercise) {
  const boxes = exercise.boxes.map((box) => {
    const element = document.createElement('div');
    element.className = `box ${box.className}`;
    element.textContent = box.label;
    return element;
  });

  scope.querySelector('[data-stage]').replaceChildren(...boxes);
}

/**
 * Envuelve un CSS para que solo afecte a una de las dos escenas, con anidado nativo.
 * @param scope Valor de `data-scope`: «target» o «result».
 * @param css CSS sin envolver.
 * @returns El CSS colgado de su escena.
 */
function scopeCss(scope, css) {
  return `[data-scope='${scope}'] {\n${css}\n}`;
}

/** Aplica el CSS fijo de la escena, la solución al objetivo y tu CSS al resultado. */
function applyCss() {
  const exercise = EXERCISES[state.current];

  ui.sceneCss.textContent = `@layer scene {\n.flexbox__scope {\n${exercise.scene}\n}\n}`;
  ui.targetCss.textContent = scopeCss('target', exercise.solution);
  ui.resultCss.textContent = scopeCss('result', ui.input.value);
}

/**
 * Mide las cajas de una escena respecto a su .stage.
 * @param scope Contenedor del objetivo o del resultado.
 * @returns Posición y tamaño de cada caja, en px y en orden del DOM.
 */
function measureBoxes(scope) {
  const stage = scope.querySelector('[data-stage]').getBoundingClientRect();

  return [...scope.querySelectorAll('.box')].map((box) => {
    const rect = box.getBoundingClientRect();
    return {
      x: rect.left - stage.left,
      y: rect.top - stage.top,
      width: rect.width,
      height: rect.height,
    };
  });
}

/**
 * Compara tus cajas con las del objetivo.
 * @param target Medidas del objetivo.
 * @param result Medidas de tu resultado.
 * @returns true si todas coinciden dentro de la tolerancia.
 */
function matches(target, result) {
  return target.every((box, index) =>
    ['x', 'y', 'width', 'height'].every(
      (key) => Math.abs(box[key] - result[index][key]) <= TOLERANCE,
    ),
  );
}

/**
 * Escribe el ancho de cada caja en rem, para ver cómo se reparte el espacio.
 * @param exercise Ejercicio.
 * @param boxes Medidas de las cajas, en px.
 * @returns «A 8rem · B 16rem · C 8rem».
 */
function formatMeasures(exercise, boxes) {
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  return boxes
    .map(
      (box, index) =>
        `${exercise.boxes[index].label} ${Number((box.width / rootSize).toFixed(1))}rem`,
    )
    .join(' · ');
}

/** Pinta los pasos de la cabecera: el activo y los conseguidos. */
function renderSteps() {
  const items = EXERCISES.map((exercise, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const isDone = state.done.includes(exercise.id);
    const doneLabel = isDone ? ', conseguido' : '';

    button.className = 'flexbox__step';
    button.type = 'button';
    button.textContent = formatNumber(index);
    button.setAttribute('aria-label', `Ejercicio ${index + 1}: ${exercise.title}${doneLabel}`);
    button.toggleAttribute('data-done', isDone);
    button.addEventListener('click', () => {
      goTo(index);
      ui.steps.querySelector('[aria-current]').focus();
    });

    if (index === state.current) {
      button.setAttribute('aria-current', 'step');
    }

    item.append(button);
    return item;
  });

  ui.steps.replaceChildren(...items);
  ui.progress.textContent = `${state.done.length} / ${EXERCISES.length} conseguidos`;
}

/**
 * Abre la enhorabuena y la centra en la ventana: el iframe mide lo que la demo, así que
 * su centro puede quedar fuera de la pantalla de la ficha.
 */
function celebrate() {
  ui.finale.showModal();
  ui.finale.scrollIntoView({ block: 'center' });
}

/** Comprueba el resultado, actualiza el estado y, si está bien, lo apunta como conseguido. */
function check() {
  const exercise = EXERCISES[state.current];
  const target = measureBoxes(ui.target);
  const result = measureBoxes(ui.result);
  const isSolved = matches(target, result);
  const [targetMeasures, resultMeasures] = document.querySelectorAll('[data-measures]');

  targetMeasures.textContent = exercise.measure ? formatMeasures(exercise, target) : '';
  resultMeasures.textContent = exercise.measure ? formatMeasures(exercise, result) : '';
  ui.status.textContent = isSolved ? 'Conseguido' : 'Sin resolver';
  ui.status.toggleAttribute('data-solved', isSolved);

  if (isSolved && !state.done.includes(exercise.id)) {
    state.done = [...state.done, exercise.id];
    saveState();
    renderSteps();

    if (state.done.length === EXERCISES.length) {
      celebrate();
    }
  }
}

/** Pinta el ejercicio activo entero: enunciado, HTML, editor, solución y escenas. */
function renderExercise() {
  const exercise = EXERCISES[state.current];

  ui.number.textContent = `Ejercicio ${formatNumber(state.current)} de ${EXERCISES.length}`;
  ui.title.textContent = exercise.title;
  ui.prompt.textContent = exercise.prompt;
  ui.markup.textContent = sceneMarkup(exercise);
  ui.input.value = state.drafts[exercise.id] ?? exercise.starter;
  ui.solution.open = false;
  ui.solutionCode.textContent = exercise.solution;
  ui.explanation.textContent = exercise.explanation;
  ui.next.disabled = state.current === EXERCISES.length - 1;

  renderBoxes(ui.target, exercise);
  renderBoxes(ui.result, exercise);
  renderSteps();
  applyCss();
  check();
}

/**
 * Cambia de ejercicio.
 * @param index Posición del ejercicio, desde 0.
 */
function goTo(index) {
  state.current = index;
  saveState();
  renderExercise();
}

ui.input.addEventListener('input', () => {
  state.drafts[EXERCISES[state.current].id] = ui.input.value;
  saveState();
  applyCss();
  check();
});

ui.next.addEventListener('click', () => goTo(state.current + 1));

ui.reset.addEventListener('click', () => {
  if (!window.confirm('¿Borrar el progreso y lo escrito en los diez ejercicios?')) {
    return;
  }

  state = emptyState();
  saveState();
  renderExercise();
});

renderExercise();
