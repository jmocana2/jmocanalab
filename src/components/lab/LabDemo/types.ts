import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

export type DemoModule = {
  default: AstroComponentFactory;
};

export type Demo =
  { kind: 'iframe'; src: string } | { kind: 'inline'; component: AstroComponentFactory };
