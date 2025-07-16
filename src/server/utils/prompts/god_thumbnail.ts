import ASSISTANT_INSTRUCTIONS from "./thumbnail_assistant";

export type TemplateVariables = {
  name: string;
  culture?: string;
};

export default function ({ name, culture }: TemplateVariables): string {
  return `
${ASSISTANT_INSTRUCTIONS}

Haz un mural panorámico (aspect ratio 1.8 / 1) que sirva de thumbnail para un artículo sobre la deidad ${
    culture ? `${culture} ${name}` : name
  }. No incluyas textos.
`;
}
