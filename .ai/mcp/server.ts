import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import addName from "../../src/server/handlers/add-name";
import addMotif from "../../src/server/handlers/add-motif";
import generateThumbnail from "../../src/server/handlers/generate-thumbnail";
import { FEATURES } from "../../src/server/constants";

const server = new McpServer({
  name: "BabilimServer",
  version: "1.0.0",
  description: "A god knowledge base library",
});

const TOOLS = [
  addName,
  addMotif,
  FEATURES.GENERATE_THUMBNAIL && generateThumbnail,
]

for (const tool of TOOLS) {
  if (!tool) {
    continue;
  }

  server.tool(
    tool.definition.name,
    tool.definition.description,
    tool.definition.schema,
    tool.handler
  );
}

const transport = new StdioServerTransport();

await server.connect(transport);
