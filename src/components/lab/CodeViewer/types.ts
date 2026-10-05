import type { ComponentProps } from 'astro/types';
import type { Code } from 'astro:components';

type CodeProps = ComponentProps<typeof Code>;

export type CodeLanguage = NonNullable<CodeProps['lang']>;

export type CodeTheme = NonNullable<CodeProps['theme']>;

export type SourceFile = {
  path: string;
  name: string;
  lang: CodeLanguage;
  code: string;
};
