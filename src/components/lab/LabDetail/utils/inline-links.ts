import type { InlinePart } from '../types';

/** Enlace con la sintaxis de Markdown: `[texto](url)`. Solo eso; el resto es texto. */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Parte un párrafo de `intro` en trozos de texto y enlaces, para pintarlos sin `set:html`.
 * @param paragraph Párrafo con enlaces escritos como en Markdown.
 * @returns Los trozos en orden, sin trozos vacíos.
 */
export function inlineLinks(paragraph: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;

  for (const match of paragraph.matchAll(LINK)) {
    parts.push({ kind: 'text', text: paragraph.slice(last, match.index) });
    parts.push({ kind: 'link', text: match[1] ?? '', href: match[2] ?? '' });
    last = match.index + match[0].length;
  }

  parts.push({ kind: 'text', text: paragraph.slice(last) });

  return parts.filter((part) => part.text !== '');
}
