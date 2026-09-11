import type { Meta, StoryObj } from '@storybook/html-vite';

import './catalog.css';
import { TRACKING, TYPE_SCALE } from './constants/tokens';
import { readToken, remToPx } from './utils/read-token';

const SAMPLE = 'Holy grail con Grid';

/**
 * Añade un par nombre/valor a la fila de metadatos de una muestra.
 * @param parent Contenedor de metadatos.
 * @param label Etiqueta visible.
 * @param value Valor ya resuelto.
 */
function addMeta(parent: HTMLElement, label: string, value: string): void {
  const name = document.createElement('span');
  name.className = 'catalog__name';
  name.textContent = label;

  const detail = document.createElement('span');
  detail.className = 'catalog__value';
  detail.textContent = value;

  parent.append(name, detail);
}

const meta: Meta = {
  title: 'Design system/Tipografía',
  parameters: {
    docs: {
      description: {
        component:
          'Escala por rol, no por número. Base `62.5%`, así que 1rem equivale a 10px. ' +
          'Solo `--text-xl` es fluido.',
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
    heading.textContent = 'Escala tipográfica';
    page.append(heading);

    TYPE_SCALE.forEach(({ token, leading, usage }) => {
      const row = document.createElement('section');
      row.className = 'type-row';

      const sample = document.createElement('p');
      sample.className = 'type-row__sample';
      sample.style.fontSize = `var(${token})`;
      sample.style.lineHeight = `var(${leading})`;
      sample.textContent = SAMPLE;

      const metadata = document.createElement('div');
      metadata.className = 'type-row__meta';

      const size = readToken(token);
      const pixels = remToPx(size);

      addMeta(metadata, token, pixels === null ? size : `${size} · ${pixels}px`);
      addMeta(metadata, leading, readToken(leading));

      const note = document.createElement('p');
      note.className = 'catalog__usage';
      note.textContent = usage;

      row.append(sample, metadata, note);
      page.append(row);
    });

    return page;
  },
};

export const Tracking: StoryObj = {
  name: 'Tracking',
  render: () => {
    const page = document.createElement('div');
    page.className = 'catalog';

    const heading = document.createElement('h2');
    heading.className = 'catalog__title';
    heading.textContent = 'Tracking';
    page.append(heading);

    TRACKING.forEach((token) => {
      const row = document.createElement('section');
      row.className = 'type-row';

      const sample = document.createElement('p');
      sample.className = 'type-row__sample';
      sample.style.letterSpacing = `var(${token})`;
      sample.style.fontSize = 'var(--text-l)';
      sample.textContent = token === '--track-ui' ? SAMPLE.toUpperCase() : SAMPLE;

      const metadata = document.createElement('div');
      metadata.className = 'type-row__meta';
      addMeta(metadata, token, readToken(token));

      row.append(sample, metadata);
      page.append(row);
    });

    return page;
  },
};
