import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";


import { kbRepository, thumbnailRepository } from "../../services";

import type definition from "./definition";
import type { KBRepository } from "../../services/KBRepository";
import { isGod, isMotif } from "../../utils/document-type";
import type { ThumbnailInstructions } from "../../services/ThumbnailRepository";

const getTemplateVariablesForGodEntry = async (document: Awaited<ReturnType<KBRepository['getDocument']>>): Promise<ThumbnailInstructions> => {
  const cultureTag = document.attributes.tags.find(t => t.startsWith('culture/'));
  
  let culture: string|undefined = undefined;

  if (cultureTag) {
    const [k, v] = cultureTag.split('/');
    culture = v;
  }

  return {
    type: 'god',
    templateVariables: {
      name: document.name,
      culture,
    }
  };
}

const getTemplateVariablesForMotifEntry = async (document: Awaited<ReturnType<KBRepository['getDocument']>>): Promise<ThumbnailInstructions> => {
  return {
    type: 'motif',
    templateVariables: {
      identifier: document.name,
      name: document.attributes.title,
    }
  };
}

const getTemplateVariables = async (entryName: string): Promise<ThumbnailInstructions> => {
  const entry = await kbRepository.getDocument(entryName);

  if (isGod(entry.name)) {
    return getTemplateVariablesForGodEntry(entry);
  }

  if (isMotif(entry.name)) {
    return getTemplateVariablesForMotifEntry(entry);
  }

  throw new Error(`Unhandled type for entry ${entry.name}`);

}

export default (async ({
  entry,
}) => {
  try {
    const entryName = entry.endsWith('.md') ? entry.slice(0, -3) : entry;

    const instructions = await getTemplateVariables(entryName);
    const thumbnail = await thumbnailRepository.generateThumbnail(entryName, instructions);
    const updated = await kbRepository.updateThumbnail(entryName, thumbnail);

    return {
      content: [
        {
          type: "text",
          text: `Generated ${thumbnail} and updated ${updated}`,
        },
      ],
    };
  } catch (e) {
    console.error(e);
    return {
      content: [
        {
          type: "text",
          text: `Error generating thumbnail for entry ${entry}. Reaon: ${(e as Error).message}`,
        },
      ],
    };
  }
}) satisfies ToolCallback<typeof definition.schema>;
