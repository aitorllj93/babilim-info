import type { AuthorContext, DocumentContext } from "../types";

export const buildAuthor = (doc: DocumentContext, author?: AuthorContext): AuthorContext|undefined => {
  if (author) {
    return author
  }

  if (!doc.data.author) {
    return undefined;
  }

  return {
    id: doc.data.author,
    collection: 'authors',
    data: {
      name: doc.data.author,
    }
  }
}