import ASSISTANT_INSTRUCTIONS from './thumbnail_assistant';

export type TemplateVariables = {
  name: string;
  identifier?: string;
};

export default function({
  name,
  identifier
}: TemplateVariables): string {
  return `
${ASSISTANT_INSTRUCTIONS}

Haz un mural panorámico (aspect ratio 1.8 / 1) que sirva de thumbnail para un artículo sobre el motif ${identifier? `${identifier}: ${name}` : name}. No incluyas textos.
`;
};