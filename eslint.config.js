// @ts-check
/*
 * Configuración de ESLint (flat config).
 * Refuerza las skills `maquetacion` y `javascript`: accesibilidad AA en las plantillas,
 * sin ternarios anidados, sin switch y sin `any`.
 *
 * El plugin de jsx-a11y lo aporta `eslint-plugin-astro` en su preset `jsx-a11y-strict`;
 * no se importa aparte.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', '.design/', 'public/labs/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],

  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Convenciones de la skill `javascript`
      'no-nested-ternary': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'SwitchStatement',
          message: 'Sin switch: usa un objeto de consulta con `satisfies Record<…>`.',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
];
