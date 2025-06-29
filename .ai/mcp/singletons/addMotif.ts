import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import addMotif from "../../../src/server/handlers/add-motif";

const server = new McpServer({
  name: "MotifsServer",
  version: "1.0.0",
  description: "A motifs library",
});

const TOOLS = [
  addMotif,
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
