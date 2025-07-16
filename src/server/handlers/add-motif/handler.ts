import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type definition from "./definition";
import { kbRepository } from "../../services";

import generateEntryThumbnail from "../generate-thumbnail";
import { FEATURES } from "../../constants";

export default (async ({
  article,
  associatedDeities,
  identifier,
  name,
  description,
  references,
}) => {
  try {
    const failedDeitiesToUpdate: string[] = [];
    for (const deity of associatedDeities) {
      await kbRepository.addTag(deity, `motif/${identifier}`).catch(() => {
        failedDeitiesToUpdate.push(deity);
        return null;
      })
    }

    const entryName = `Motifs/${identifier}`;
    const frontmatter: Record<string, string | string[] | undefined> = {
      title: name,
      description,
      tags: ['definition/motif'],
      references: references?.length ? references : undefined,
    }

    if (failedDeitiesToUpdate.length > 0) {
      frontmatter.deities = failedDeitiesToUpdate;
    }

    const content = await kbRepository.addDocument(entryName, article, frontmatter);

    let thumbnailResponse: Awaited<ReturnType<typeof generateEntryThumbnail.handler>> | undefined;
    if (FEATURES.GENERATE_THUMBNAIL) {
      thumbnailResponse = await generateEntryThumbnail.handler({
        entry: entryName,
      })
    }

    return {
      content: [
        {
          type: "text",
          text: content,
        },
        ...(thumbnailResponse?.content ?? []),
      ],
    };
  } catch (e) {
    console.error(e);
    return {
      content: [
        {
          type: "text",
          text: `Error adding motif ${name}. Reason: ${(e as Error).message}`,
        },
      ],
    };
  }
}) satisfies ToolCallback<typeof definition.schema>;