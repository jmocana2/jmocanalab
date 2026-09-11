import type { StorybookConfig } from '@storybook/html-vite';

/*
 * Storybook — catálogo del design system.
 * Las stories consumen `src/styles/global.css`: nunca definen estilos propios.
 */
const config: StorybookConfig = {
  framework: '@storybook/html-vite',
  stories: ['../src/**/*.stories.ts'],
  // Proyecto personal: nada de telemetría saliendo de la máquina.
  core: { disableTelemetry: true },
};

export default config;
