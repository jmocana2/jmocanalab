export type InlinePart =
  { kind: 'text'; text: string } | { kind: 'link'; text: string; href: string };
