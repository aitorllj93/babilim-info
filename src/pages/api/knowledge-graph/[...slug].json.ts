import type { APIRoute } from "astro";

import { getDocumentPageStaticPaths, getGlobalKnowledgeGraph } from "../../../helpers/getProps"

export const GET: APIRoute = async ({ params }) => {
  const data = await getGlobalKnowledgeGraph(params.slug);

  return new Response(
    JSON.stringify(data),
  );
}

export const getStaticPaths = getDocumentPageStaticPaths;