import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createInterface, type Interface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { CATEGORIES } from '../../src/constants/categories.ts';
import { RUNTIMES, SLUG_PATTERN } from './constants/index.ts';
import type { Category, Field, LabInput, Runtime } from './types.ts';
import { isoDate } from './utils/format.ts';
import { labFiles } from './utils/lab-files.ts';

/** Categoría: una de las cerradas del esquema. */
const CATEGORY_FIELD: Field<Category> = {
  flag: 'category',
  question: `Categoría (${CATEGORIES.join(' / ')}): `,
  parse: (value) => CATEGORIES.find((category) => category === value),
  hint: `Opciones: ${CATEGORIES.join(', ')}.`,
};

/** Título visible, en español. */
const TITLE_FIELD: Field<string> = {
  flag: 'title',
  question: 'Título (en español): ',
  parse: (value) => value || undefined,
  hint: 'No puede estar vacío.',
};

/** Slug de la URL, en inglés: no se deduce del título, que va en español. */
const SLUG_FIELD: Field<string> = {
  flag: 'slug',
  question: 'Slug (en inglés, kebab-case): ',
  parse: (value) => (SLUG_PATTERN.test(value) ? value : undefined),
  hint: 'En inglés, minúsculas, ASCII y kebab-case, empezando por letra: «flex-grid».',
};

/** Cómo se muestra la demo. */
const RUNTIME_FIELD: Field<Runtime> = {
  flag: 'runtime',
  question: `Runtime (${RUNTIMES.join(' / ')}): `,
  parse: (value) => RUNTIMES.find((runtime) => runtime === value),
  hint: `Opciones: ${RUNTIMES.join(', ')}. «island» llega con la integración de React.`,
};

/**
 * Crea un experimento nuevo: la ficha en `src/content/labs/` y el esqueleto de su demo.
 * Uso: `pnpm new:lab` pregunta lo que falte; con `--category`, `--title`, `--slug` y
 * `--runtime` no pregunta nada. Nunca sobrescribe: si algún fichero ya existe, no crea ninguno.
 */
async function main(): Promise<void> {
  const input = await readInput();
  const files = labFiles(input, isoDate(new Date()));
  const taken = files.filter((file) => existsSync(file.path));

  if (taken.length > 0) {
    throw new Error(`Ya existe:\n${taken.map((file) => `  ${file.path}`).join('\n')}`);
  }

  await Promise.all(
    files.map(async (file) => {
      await mkdir(dirname(file.path), { recursive: true });
      await writeFile(file.path, file.content, { flag: 'wx' });
    }),
  );

  process.stdout.write(
    [
      '',
      'Creado:',
      ...files.map((file) => `  ${file.path}`),
      '',
      `Ficha: /labs/${input.category}/${input.slug}`,
      'Falta el resumen (`summary`) de la ficha.',
      '',
    ].join('\n'),
  );
}

/**
 * Reúne los datos del experimento: primero de los argumentos y, si falta alguno, preguntando.
 * @returns Los datos ya validados.
 */
async function readInput(): Promise<LabInput> {
  const { values } = parseArgs({
    options: {
      category: { type: 'string' },
      title: { type: 'string' },
      slug: { type: 'string' },
      runtime: { type: 'string' },
    },
  });

  const prompt = process.stdin.isTTY
    ? createInterface({ input: process.stdin, output: process.stdout })
    : undefined;

  try {
    return {
      category: await resolveField(CATEGORY_FIELD, values.category, prompt),
      title: await resolveField(TITLE_FIELD, values.title, prompt),
      slug: await resolveField(SLUG_FIELD, values.slug, prompt),
      runtime: await resolveField(RUNTIME_FIELD, values.runtime, prompt),
    };
  } finally {
    prompt?.close();
  }
}

/**
 * Obtiene el valor de un campo. Un argumento inválido es un error, no una pregunta: quien
 * pasa argumentos espera que el script no se pare a preguntar.
 * @param field Campo que se quiere obtener.
 * @param value Valor recibido por argumento, si lo hay.
 * @param prompt Interfaz para preguntar; no existe si la entrada no es una terminal.
 * @returns El valor validado.
 */
async function resolveField<T>(
  field: Field<T>,
  value: string | undefined,
  prompt: Interface | undefined,
): Promise<T> {
  if (value !== undefined) {
    return parseOrThrow(field, value);
  }

  if (!prompt) {
    throw new Error(`Falta --${field.flag}. ${field.hint}`);
  }

  return ask(field, prompt);
}

/**
 * Valida un valor recibido por argumento.
 * @param field Campo al que pertenece.
 * @param value Valor recibido.
 * @returns El valor validado.
 */
function parseOrThrow<T>(field: Field<T>, value: string): T {
  const parsed = field.parse(value.trim());

  if (parsed === undefined) {
    throw new Error(`--${field.flag} no válido: «${value}». ${field.hint}`);
  }

  return parsed;
}

/**
 * Pregunta por un campo hasta que la respuesta es válida.
 * @param field Campo por el que se pregunta.
 * @param prompt Interfaz de la terminal.
 * @returns El valor validado.
 */
async function ask<T>(field: Field<T>, prompt: Interface): Promise<T> {
  const parsed = field.parse((await prompt.question(field.question)).trim());

  if (parsed !== undefined) {
    return parsed;
  }

  process.stdout.write(`${field.hint}\n`);

  return ask(field, prompt);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
