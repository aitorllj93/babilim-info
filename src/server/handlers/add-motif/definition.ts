import { z } from "zod";

export default {
  name: "add-motif",
  description:
    "Tool to add motifs from the Motif-Index of Folk-Literature to the database",
  schema: {
    identifier: z
      .string()
      .describe(
        'Motif-Index identifier. Eg: "A210" for Sky God or "A515.1.1.1" for Twin culture heroes sired by two fathers'
      ),
    name: z.string().describe("The Motif name"),
    description: z
      .string()
      .optional()
      .describe(
        "poetic or evocative that invites you to read (e.g., “The breath that unleashed the Sumerian storms”)."
      ),
    article: z
      .string()
      .describe(
        "The article including the explanation and analysis of the motify, myths, traditions and cults"
      ),
    associatedDeities: z
      .string()
      .array()
      .describe("list of deities that are directly associated with this motif"),
    references: z
      .array(z.string())
      .optional()
      .describe(
        "references to internet articles talking about this god such as wikipedia"
      ),
  },
};
