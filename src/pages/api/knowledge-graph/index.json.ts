import type { APIRoute } from "astro";

import { getGlobalKnowledgeGraph } from "../../../helpers/getProps"

export const GET: APIRoute = async () => {
  const data = await getGlobalKnowledgeGraph();

  return new Response(
    JSON.stringify(data),
  );
}