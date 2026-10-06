import type { CollectionEntry } from 'astro:content';
import type { THEMES } from './constants/theme';

export type Lab = CollectionEntry<'labs'>;

export type Category = Lab['data']['category'];

export type Status = Lab['data']['status'];

export type Theme = (typeof THEMES)[number];
