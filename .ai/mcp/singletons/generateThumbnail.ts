import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import generateThumbnail from "../../../src/server/handlers/generate-thumbnail";

const server = new McpServer({
  name: "ThumbnailsServer",
  version: "1.0.0",
  description: "A thumbnails generator library",
});

const TOOLS = [
  generateThumbnail,
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
