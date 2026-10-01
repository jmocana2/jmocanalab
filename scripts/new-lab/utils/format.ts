/**
 * Formatea una fecha como `AAAA-MM-DD` en hora local, que es lo que espera el frontmatter.
 * @param date Fecha que se quiere formatear.
 * @returns La fecha en formato ISO corto: «2026-10-01».
 */
export function isoDate(date: Date): string {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
}

/**
 * Convierte un slug en nombre de componente.
 * @param slug Slug en kebab-case: «flex-grid».
 * @returns El nombre en PascalCase: «FlexGrid».
 */
export function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Entrecomilla un texto para el frontmatter como lo haría Prettier: comillas simples,
 * salvo que el texto lleve apóstrofos y ninguna comilla doble.
 * @param text Texto que se quiere insertar.
 * @returns El texto como cadena YAML válida: «'Flex y Grid'».
 */
export function yamlString(text: string): string {
  if (text.includes("'") && !text.includes('"')) {
    return JSON.stringify(text);
  }

  return `'${text.replaceAll("'", "''")}'`;
}

/**
 * Escapa los caracteres con significado en HTML para poder insertar texto en una plantilla.
 * @param text Texto que se quiere insertar.
 * @returns El texto con `&`, `<` y `>` escapados.
 */
export function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
