import { type CollectionEntry } from "astro:content";
import Case from "case";
import { TAGS_COLLECTION_NAME } from "../constants";
import type { DocumentContext, TagsContext } from "../types";


export const ignoreTags = [
  'trait/creator_deity',
  'trait/deity',
  'type/deity',
  "trait/divine",
  "trait/eternal",
  "trait/celestial",
  "trait/sky",
  "trait/chthonic",
  "type/human",
  "type/monster",
  "type/god",
  "type/spirit",
  "trait/adversary",
  "trait/supreme-deity",
  "trait/goddess"
]

export const buildTags = (
  doc: DocumentContext,
  collectionTags: CollectionEntry<typeof TAGS_COLLECTION_NAME>[]
): TagsContext => {
  const tags = doc.data.tags?.filter(t => !ignoreTags.includes(t)).map(t => {
    const inCollection = collectionTags.find((ct) => ct.data.id === t);

    if (!t) {
      throw new Error('missing t')
    }

    if (inCollection) {
      return inCollection
    };

    const [type, name] = t.split('/');

    return {
      id: t,
      collection: 'tags',
      data: {
        id: t,
        description: '',
        name: Case.title(name),
        type: Case.title(type),
      }
    }
  }).sort((a, b) => {
    // first Cultures, then Domains, then Traits
    const [aType] = a.id.split('/');
    const [bType] = b.id.split('/');

    if (aType === 'culture' && bType !== 'culture') {
      return -1;
    } else if (bType === 'culture' && aType !== 'culture') {
      return 1;
    } else if (aType === 'domain' && bType !== 'domain') {
      return -1;
    } else if (bType === 'domain' && aType !== 'domain') {
      return 1;
    } else if (aType === 'trait' && bType !== 'trait') {
      return -1;
    } else if (bType === 'trait' && aType !== 'trait') {
      return 1;
    } else {
      return 0;
    }
  }).filter(Boolean) as CollectionEntry<typeof TAGS_COLLECTION_NAME>[];
  
  return {
    tags,
  };
};
