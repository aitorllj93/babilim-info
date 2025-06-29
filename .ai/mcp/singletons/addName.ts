import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import addName from "../../../src/server/handlers/add-name";

const server = new McpServer({
  name: "NamesServer",
  version: "1.0.0",
  description: "A god names library",
});

const TOOLS = [
  addName,
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
