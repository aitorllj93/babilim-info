import { z } from "zod";

import { FEATURES } from "../../constants";

export default {
  name: "add-name",
  description: `"Tool to add names to the knowledge base. ${
    FEATURES.GENERATE_THUMBNAIL ? "Additionally generates a thumbnail for the entry." : ""
  }`,
  schema: {
    name: z.string(),
    slug: z
      .string()
      .describe("name, include the culture in case of an ambiguous name"),
    subtitle: z
      .string()
      .optional()
      .describe(
        " epithet or cult title (e.g. “lord of the winds”). Preferably related to the etymology of the name"
      ),
    description: z
      .string()
      .optional()
      .describe(
        "poetic or evocative that invites you to read (e.g., “The breath that unleashed the Sumerian storms”)."
      ),
    article: z
      .string()
      .describe(
        "The article including the etymology of the name, myths, traditions and cults"
      ),
    tags: z
      .array(z.string())
      .describe(
        'tags for this god including cultures and traits. Eg. "culture/greek", "trait/thunder", "trait/male"'
      ),
    references: z
      .array(z.string())
      .optional()
      .describe(
        "references to internet articles talking about this god such as wikipedia"
      ),
    father: z
      .string()
      .optional()
      .describe('father of this god in wikilink format. Eg "[[Zeus]]"'),
    mother: z
      .string()
      .optional()
      .describe('mother of this god in wikilink format. Eg "[[Hera]]"'),
    siblings: z
      .array(z.string())
      .optional()
      .describe('brothers of this god in wikilink format. Eg "[[Zeus]]"'),
    spouses: z
      .array(z.string())
      .optional()
      .describe('spouses of this god in wikilink format. Eg "[[Zeus]]"'),
    offspring: z
      .array(z.string())
      .optional()
      .describe('offspring of this god in wikilink format. Eg "[[Zeus]]"'),
    enemies: z
      .array(z.string())
      .optional()
      .describe('enemies of this god in wikilink format. Eg "[[Zeus]]"'),
    allies: z
      .array(z.string())
      .optional()
      .describe('allies of this god in wikilink format. Eg "[[Zeus]]"'),
    cognates: z
      .array(z.string())
      .optional()
      .describe('cognates of this god in wikilink format. Eg "[[Zeus]]"'),
    syncretics: z
      .array(z.string())
      .optional()
      .describe(
        'syncretics (non cognates) of this god in wikilink format. Eg "[[Zeus]]"'
      ),
    aliases: z
      .array(z.string())
      .optional()
      .describe(
        'alternative names of this god. Eg "Zeus"'
      ),
    relateds: z
      .array(z.string())
      .optional()
      .describe(
        'Deprecated, use other relationship fields instead. related gods such as "father", "son", "brother", "sister", "mother", "cognates" in wikilink format'
      ),
  },
};
