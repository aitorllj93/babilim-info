import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";


import { kbRepository } from "../../services";

import generateEntryThumbnail from "../generate-thumbnail";
import type definition from "./definition";
import { FEATURES } from "../../constants";

export default (async ({
  name,
  description,
  subtitle,
  slug,
  article,
  aliases,
  tags,
  father,
  mother,
  spouses,
  siblings,
  offspring,
  enemies,
  allies,
  cognates,
  syncretics,
  relateds,
  references,
}) => {
  try {
    const content = await kbRepository.addDocument(name, article, {
      title: name,
      subtitle: subtitle ?? "",
      description: description ?? "",
      tags: tags,
      references: references?.length ? references : undefined,
      father: father
        ? father.startsWith("[")
          ? father
          : `[[${father}]]`
        : undefined,
      mother: mother
        ? mother.startsWith("[")
          ? mother
          : `[[${mother}]]`
        : undefined,
      spouses: spouses?.map((s) => (s.startsWith("[") ? s : `[[${s}]]`)),
      siblings: siblings?.map((s) => (s.startsWith("[") ? s : `[[${s}]]`)),
      offspring: offspring?.map((o) => (o.startsWith("[") ? o : `[[${o}]]`)),
      enemies: enemies?.map((e) => (e.startsWith("[") ? e : `[[${e}]]`)),
      allies: allies?.map((a) => (a.startsWith("[") ? a : `[[${a}]]`)),
      cognates: cognates?.map((c) => (c.startsWith("[") ? c : `[[${c}]]`)),
      syncretics: syncretics?.map((s) => (s.startsWith("[") ? s : `[[${s}]]`)),
      relateds: relateds?.map((r) => (r.startsWith("[") ? r : `[[${r}]]`)),
      aliases: aliases?.length ? aliases : undefined,
    });

    let thumbnailResponse: Awaited<ReturnType<typeof generateEntryThumbnail.handler>> | undefined;
    if (FEATURES.GENERATE_THUMBNAIL) {
      thumbnailResponse = await generateEntryThumbnail.handler({
        entry: name,
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
          text: `Error adding document ${name}. Reason: ${(e as Error).message}`,
        },
      ],
    };
  }
}) satisfies ToolCallback<typeof definition.schema>;
