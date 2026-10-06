/**
 * Temas del sitio. El activo va en `data-theme` del `<html>`, y `tokens.css` redefine
 * los colores para `dark`. Añadir uno aquí obliga a darle valores en `tokens.css`.
 */
export const THEMES = ['light', 'dark'] as const;

/**
 * Clave de `localStorage` donde se guarda la elección del usuario. Sin elección, manda
 * `prefers-color-scheme`. Cambiarla hace que todo el mundo vuelva al tema del sistema.
 */
export const THEME_STORAGE_KEY = 'theme';
