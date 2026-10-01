/** Runtimes con esqueleto de demo. `island` queda fuera hasta que exista la integración de React. */
export const RUNTIMES = ['iframe', 'inline'] as const;

/**
 * Slug válido: inglés, ASCII y kebab-case. Empieza por letra porque también es el nombre
 * del bloque BEM de la demo, y una clase CSS no puede empezar por número.
 */
export const SLUG_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
