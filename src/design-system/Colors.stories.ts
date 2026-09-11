import type { Meta, StoryObj } from '@storybook/html-vite';

import './catalog.css';
import { CATEGORIES, COLOR_GROUPS } from './constants/tokens';
import { readToken } from './utils/read-token';

/**
 * Pinta una muestra de color leyendo su valor del CSS real.
 * @param name Nombre del token.
 * @param scope Elemento desde el que se resuelve, para los acentos por categoría.
 * @returns El elemento de la muestra, listo para insertar.
 */
function swatch(name: string, scope?: Element): HTMLElement {
  const item = document.createElement('li');

  const chip = document.createElement('div');
  chip.className = 'swatch__chip';
  chip.style.backgroundColor = `var(${name})`;

  const label = document.createElement('p');
  label.className = 'catalog__name swatch__name';
  label.textContent = name;

  const value = document.createElement('p');
  value.className = 'catalog__value';
  value.textContent = readToken(name, scope);

  item.append(chip, label, value);
  return item;
}

/**
 * Construye un grupo del catálogo con su título y su rejilla de muestras.
 * @param title Título visible del grupo.
 * @param tokens Tokens que se catalogan.
 * @param scope Elemento desde el que se resuelven los valores.
 * @returns La sección del grupo.
 */
function group(title: string, tokens: readonly string[], scope?: Element): HTMLElement {
  const section = document.createElement('section');
  section.className = 'catalog__group';

  const heading = document.createElement('h2');
  heading.className = 'catalog__title';
  heading.textContent = title;

  const grid = document.createElement('ul');
  grid.className = 'catalog__grid';
  tokens.forEach((token) => grid.append(swatch(token, scope)));

  section.append(heading, grid);
  return section;
}

const meta: Meta = {
  title: 'Design system/Color',
  parameters: {
    docs: {
      description: {
        component:
          'Paleta del sitio. Los valores se leen de `tokens.css` en tiempo de ejecución: ' +
          'esta página no mantiene una segunda lista.',
      },
    },
  },
};

export default meta;

export const Palette: StoryObj = {
  name: 'Paleta',
  render: () => {
    const page = document.createElement('div');
    page.className = 'catalog';

    COLOR_GROUPS.forEach(({ title, tokens }) => page.append(group(title, tokens)));
    return page;
  },
};

export const CategoryAccents: StoryObj = {
  name: 'Acento por categoría',
  render: () => {
    const page = document.createElement('div');
    page.className = 'catalog';

    const heading = document.createElement('h2');
    heading.className = 'catalog__title';
    heading.textContent = 'El acento se hereda de data-category';

    const grid = document.createElement('ul');
    grid.className = 'catalog__grid';

    CATEGORIES.forEach((category) => {
      const item = document.createElement('li');
      // El propio item marca la categoría: `--color-accent` se resuelve por herencia.
      item.dataset.category = category;

      const chip = document.createElement('div');
      chip.className = 'swatch__chip';
      chip.style.backgroundColor = 'var(--color-accent)';

      const label = document.createElement('p');
      label.className = 'catalog__name swatch__name';
      label.textContent = `data-category="${category}"`;

      const value = document.createElement('p');
      value.className = 'catalog__value';

      item.append(chip, label, value);
      grid.append(item);

      // El valor calculado solo existe una vez el elemento está en el documento.
      requestAnimationFrame(() => {
        value.textContent = readToken('--color-accent', item);
      });
    });

    page.append(heading, grid);
    return page;
  },
};
