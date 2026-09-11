import type { Preview } from '@storybook/html-vite';

// Único acoplamiento entre Storybook y el sitio: la hoja de estilos real.
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: { expanded: true },
  },
};

export default preview;
