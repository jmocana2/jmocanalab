/**
 * Formato de fecha de la ficha. En UTC porque las fechas del frontmatter son días sin hora
 * y Zod las crea a medianoche UTC: en otra zona horaria podrían caer en el día anterior.
 */
const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Escribe una fecha para leerla en la ficha.
 * @param date Fecha del frontmatter.
 * @returns La fecha corta en español: «25 sept 2026».
 */
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

/**
 * Escribe una fecha en el formato del atributo `datetime` de `<time>`.
 * @param date Fecha del frontmatter.
 * @returns La fecha en ISO, sin hora: «2026-09-25».
 */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
