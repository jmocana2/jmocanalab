import type { Meta, StoryObj } from '@storybook/html-vite';

import './catalog.css';
import { LAYOUT_TOKENS, SPACE_STEPS } from './constants/tokens';
import { readToken, remToPx } from './utils/read-token';

const meta: Meta = {
  title: 'Design system/Espaciado',
  parameters: {
    docs: {
      description: {
        component:
          'Trece pasos que absorben los valores de la maqueta con una desviación máxima ' +
          'de 2px. El aire es el layout: se controla desde aquí.',
      },
    },
  },
};

export default meta;

export const Scale: StoryObj = {
  name: 'Escala',
  render: () => {
    const page = document.createElement('div');
    page.className = 'catalog';

    const heading = document.createElement('h2');
    heading.className = 'catalog__title';
    heading.textContent = 'Escala de espaciado';
    page.append(heading);

    SPACE_STEPS.forEach((token) => {
      const row = document.createElement('section');
      row.className = 'space-row';

      const name = document.createElement('span');
      name.className = 'catalog__name';
      name.textContent = token;

      const value = document.createElement('span');
      value.className = 'catalog__value';
      const size = readToken(token);
      const pixels = remToPx(size);
      value.textContent = pixels === null ? size : `${size} · ${pixels}px`;

      const bar = document.createElement('div');
      bar.className = 'space-row__bar';
      bar.style.inlineSize = `var(${token})`;

      row.append(name, value, bar);
      page.append(row);
    });

    return page;
  },
};

export const Layout: StoryObj = {
  name: 'Layout',
  render: () => {
    const page = document.createElement('div');
    page.className = 'catalog';

    const heading = document.createElement('h2');
    heading.className = 'catalog__title';
    heading.textContent = 'Tokens de layout';
    page.append(heading);

    LAYOUT_TOKENS.forEach((token) => {
      const row = document.createElement('section');
      row.className = 'space-row';

      const name = document.createElement('span');
      name.className = 'catalog__name';
      name.textContent = token;

      const value = document.createElement('span');
      value.className = 'catalog__value';
      value.textContent = readToken(token);

      row.append(name, value, document.createElement('span'));
      page.append(row);
    });

    return page;
  },
};
