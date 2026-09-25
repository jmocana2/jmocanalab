import type { CollectionEntry } from 'astro:content';

export type Lab = CollectionEntry<'labs'>;

export type Category = Lab['data']['category'];

export type Status = Lab['data']['status'];
