// @ts-check
import { defineConfig } from 'astro/config';

// El único sitio del proyecto donde aparece el host. Todo lo demás, rutas relativas.
export default defineConfig({
  site: 'https://jmocanalab.vercel.app',
  output: 'static',

  // Abre el navegador al arrancar `pnpm dev`.
  server: { open: true },
});
