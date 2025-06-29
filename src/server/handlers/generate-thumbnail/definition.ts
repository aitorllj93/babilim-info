import { z } from "zod";

export default {
  name: "generate-thumbnail",
  description: "Tool to generate thumbnails for knowledge base entries",
  schema: {
    entry: z
      .string()
      .describe("The entry name to generate a thumbnail for"),
  },
};