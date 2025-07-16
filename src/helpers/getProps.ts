import { getCollection, type CollectionEntry } from "astro:content";
import Case from "case";

import { DOCUMENTS_COLLECTION_NAME, TAGS_COLLECTION_NAME } from "../constants";
import type { AuthorContext, DocumentContext, NavigationContext, Node, PageContext, TagsContext } from "../types";
import { buildAuthor } from "./buildAuthor";
import { buildDocPage, buildGodsIndexPage, buildIndexPage, buildMythemesIndexPage, buildTagPage, buildTagsIndexPage } from "./buildPage";
import { buildTags, ignoreTags } from "./buildTags";
import { buildTree } from "./buildTree";

const allDocuments =(await getCollection(DOCUMENTS_COLLECTION_NAME)).filter(d => d.data.publish !== false);
const documentTags = [...new Set(allDocuments.flatMap((d) => d.data.tags))].filter((t) => t && !ignoreTags.includes(t)) as string[];
const definedTags = await getCollection(TAGS_COLLECTION_NAME);

export const isMyth = (d: CollectionEntry<'documents'>) => d.id.startsWith('myths/');
export const isCulture = (d: CollectionEntry<'documents'>) => d.id.startsWith('cultures/');
export const isDraft = (d: CollectionEntry<'documents'>) => d.id.startsWith('drafts/');
export const isMotif = (d: CollectionEntry<'documents'>) => d.id.startsWith('motifs/');
export const isMytheme = (d: CollectionEntry<'documents'>) => d.id.startsWith('mythemes/');
export const isGod = (d: CollectionEntry<'documents'>) => !isMytheme(d) && !isDraft(d) && !isCulture(d) && !isMyth(d) && !isMotif(d);
export const isTagged = (d: CollectionEntry<'documents'>, t: CollectionEntry<'tags'>) => d.data.tags?.some((dt) => dt === t.data.id)

const ALPHABET = [
  '*',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

const allTags = documentTags.map(tag => {
  const inCollection = definedTags.find((ct) => ct.data.id === tag);
  const [type, name] = tag.split('/').map(Case.title);

  if (inCollection) {
    inCollection.data.type = type as typeof inCollection.data.type;
    return inCollection;
  }


  return {
    id: tag,
    collection: "tags",
    data: {
      id: tag,
      description: '',
      name,
      type,
    },
  } as CollectionEntry<'tags'>;
});

const tagCounts: Record<string, number> = allTags.reduce(
  (acc, t) =>
    Object.assign(acc, {
      [t.data.id]: allDocuments.filter((d) => d.data.tags?.includes(t.data.id))
        .length,
    }),
  {}
);

allTags.sort((a, b) => tagCounts[b.data.id] - tagCounts[a.data.id]);


const allGods = allDocuments.filter(d => isGod(d));

const allGodsByAlphabet: Map<string, DocumentContext[]> = new Map();

for (const god of allGods) {
  const startLetter = god.id.charAt(0).toUpperCase();

  const inIndex = ALPHABET.indexOf(startLetter);

  if (inIndex) {
    if (!allGodsByAlphabet.has(startLetter)) {
      allGodsByAlphabet.set(startLetter, []);
    }
    allGodsByAlphabet.get(startLetter)?.push(god);
  } else {
    if (!allGodsByAlphabet.has('*')) {
      allGodsByAlphabet.set('*', []);
    }
    allGodsByAlphabet.get('*')?.push(god);
  }
}

const addMotifToTree = (
  item: CollectionEntry<'documents'>,
  tree:  Node<CollectionEntry<'documents'>>
) => {
  const [_, identifier] = item.id.split('/');
  const levels = identifier.split('');

  let currentItem = tree;

  for (const [indexStr, level] of Object.entries(levels)) {
    const index = Number.parseInt(indexStr, 10);
    const isSeparator = level === '.';
    const isLastLevel = index === levels.length - 1;
    const isIndex = isLastLevel && level === '0';
  
    const levelIdentifier = identifier.slice(0, index + 1);
    const permalink = isLastLevel ? `/motifs/${levelIdentifier}` : `/motifs/${levelIdentifier.padEnd(index + 2, '0')}`;
    const name = isLastLevel ? `${identifier.toUpperCase()} - ${item.data.title}` : levelIdentifier;
    const children = isIndex ? [
      {
        name,
        permalink,
        children: [],
        // data: item,
      }
    ] : [];

    if (isSeparator) {
      continue;
    }

    if (isIndex) {
      currentItem.name = name;
      currentItem.permalink = permalink;
      currentItem.children = currentItem.children?.concat(children);
      // currentItem.data = item;
      continue;
    }

    currentItem.children = currentItem.children ?? [];
    let inChildren: Node<CollectionEntry<'documents'>>|undefined = currentItem.children.find(
      c => c.permalink === permalink,
    );

    if (!inChildren) {
      inChildren = {
        name,
        permalink,
        children,
        // data: isLastLevel ? item : undefined,
      }
      currentItem.children.push(inChildren);
    }

    currentItem = inChildren;
  }

}
 
const buildMotifsTree = () => {
  const allMotifs = allDocuments.filter(d => isMotif(d));

  const root = {
    permalink: '/motifs',
    name: 'Motifs',
    children: [],
  }

  for (const motif of allMotifs) {
    addMotifToTree(motif, root);
  }

  return [root]
}

const tree: Node<CollectionEntry<'documents'>>[] = [
  {
    permalink: '/tags',
    name: 'Tags',
  },
  {
    permalink: '/gods',
    name: 'Gods',
    children: ALPHABET.filter(l => allGodsByAlphabet.has(l)).map(l => ({
      name: l,
      permalink: `/gods/${l.toLowerCase()}`,
    }))
  },
  {
    permalink: '/cultures',
    name: 'Cultures',
    children: [
      {
        name: 'Greek',
        permalink: '/cultures/greek',    
      }
    ]
  },
  ...buildMotifsTree(),
  ...buildTree(allDocuments.filter(d => isMytheme(d))),
];

export const getTags = () => {
  return allTags;
};

export const getTag = (slug: string) => {
  return allTags.find((t) => t.id === slug);
}

export const getTagById = (id: string) => {
  return allTags.find((t) => t.data.id === id);
}

export const getDocuments = () => {
  return allDocuments;
};

export const getDocument = (slug: string) => {
  return allDocuments.find((d) => d.id === slug);
}

export const getHomePageStaticPaths = () => {
  return {
    props: {
      navigation: {
        tree,
        backlinks: [],
      },
      page: buildIndexPage(),
    }
  }
}

export const getAllTagsPageStaticPaths = () => {
  const byType = allTags.reduce((acc, tag) => {
    switch (tag.data.type) {
      case 'Culture':
        acc.cultures.push(tag);
        break;
      case 'Domain':
        acc.domains.push(tag);
        break;
      case 'Trait':
        acc.traits.push(tag);
        break;
      default:
        acc.rest.push(tag);
        break;
    }
    
    return acc;

  }, {
    cultures: [] as CollectionEntry<'tags'>[],
    domains: [] as CollectionEntry<'tags'>[],
    traits: [] as CollectionEntry<'tags'>[],
    rest: [] as CollectionEntry<'tags'>[]
  });

  return {
    params: {},
    props: {
      tags: byType,
      counts: tagCounts,
      navigation: {
        tree,
        backlinks: [],
      },
      page: buildTagsIndexPage(),
    },
  }
}
export const getAllMythemesPageStaticPaths = () => {
  return {
    params: {},
    props: {
      documents: allDocuments.filter(d => isMytheme(d)),
      navigation: {
        tree,
        backlinks: [],
      },
      page: buildMythemesIndexPage(),
    },
  }
}

export const getAllGodsPageStaticPaths = () => {
  return {
    params: {},
    props: {
      documents: allDocuments.filter(d => isGod(d)),
      tags: allTags,
      navigation: {
        tree,
        backlinks: [],
      },
      page: buildGodsIndexPage(),
    },
  }
}

type AllGodsByAlphabetPageStaticPaths = {
  params: {
    letter: string;
  };
  props: {
    documents: DocumentContext[];
    tags: CollectionEntry<'tags'>[];
    navigation: NavigationContext;
    page: PageContext;
    staticPaths: AllGodsByAlphabetPageStaticPaths[];
  };
}

export const getAllGodsByAlphabetPageStaticPaths = () => {
  const staticPaths = ALPHABET.filter(l => allGodsByAlphabet.has(l)).map(letter => {
    return {
      params: {
        letter: letter.toLowerCase(),
      },
      props: {
        documents: allGodsByAlphabet.get(letter) ?? [],
        tags: allTags,
        navigation: {
          tree,
          backlinks: [],
        },
        page: buildGodsIndexPage(),
        staticPaths: [],
      }
    } as AllGodsByAlphabetPageStaticPaths
  });

  for (const path of staticPaths) {
    path.props.staticPaths = staticPaths;
  }

  return staticPaths;
}

const mapTagToEntry = (str: string) => {
  if (str.startsWith('culture/')) {
    return str.replace('culture/', 'cultures/')
  }

  if (str.startsWith('motif/')) {
    return str.replace('motif/', 'motifs/').replaceAll('.', '').toLowerCase();
  }

  return str;
};
export const getTagPageStaticPaths = (): Promise<{
  params: {
    tag: string,
  },
  props: {
    author?: AuthorContext;
    documents: DocumentContext[];
    entry?: DocumentContext;
    navigation: NavigationContext;
    page: PageContext;
    tag: CollectionEntry<"tags">;
    tags: CollectionEntry<"tags">[];
  }
}[]> => {

  return Promise.all(allTags.map(async (tag) => {
    const tagEntryId = mapTagToEntry(tag.id);
    const entry = allDocuments.find(d => (isCulture(d) || isMotif(d)) && d.id === tagEntryId);
    
    return ({
      params: {
        tag: tag.id,
      },
      props: {
        entry,
        tag,
        tags: allTags,
        documents: allDocuments.filter((d) =>
          isGod(d) && isTagged(d, tag)
        ),
        navigation: {
          tree,
          backlinks: [],
        },
        page: buildTagPage(tag),
      }
    });
  }));
}


export const getCulturePageStaticPaths = (): Promise<{
  params: {
    culture: string,
  },
  props: {
    author?: AuthorContext;
    documents: DocumentContext[];
    entry?: DocumentContext;
    navigation: NavigationContext;
    page: PageContext;
    tag: CollectionEntry<"tags">;
    tags: CollectionEntry<"tags">[];
  }
}[]> => {
  return Promise.all(allTags.filter(t => t.id.startsWith('culture/')).map(async (tag) => {
    const [_, slug] = tag.id.split('/');
    const tagEntryId = mapTagToEntry(tag.id);
    const entry = allDocuments.find(d => isCulture(d) && d.id === tagEntryId);
    
    return ({
      params: {
        culture: slug,
      },
      props: {
        entry,
        tag,
        tags: allTags,
        documents: allDocuments.filter((d) =>
          isGod(d) && isTagged(d, tag)
        ),
        navigation: {
          tree,
          backlinks: [],
        },
        page: buildTagPage(tag),
      }
    });
  }));
}

export const getDocumentPageStaticPaths = () => {
  const documents = allDocuments.filter(d => isGod(d) || isMytheme(d));
  return documents.map(document => ({
    params: {
      slug: document.data.slug ?? document.id,
    },
    props: {
      document,
      navigation: {
        tree,
        backlinks: allDocuments.filter((d) =>
          d.data.links?.some((l) => l.href === document.data.permalink)
        ),
      },
      page: buildDocPage(document),
      tags: buildTags(
        document,
        allTags,
      ),
    }
  }));
}


export const getMotifPageStaticPaths = () => {
  const documents = allDocuments.filter(d => isMotif(d));

  return documents.map(document => {
    const [_, motif] = (document.data.slug ?? document.id).split('/');

    const tag = `motif/${motif.toUpperCase()}`;

    const gods = allGods.filter(g => g.data.tags?.some(t => t.replaceAll('.', '') === tag));

    return {
      params: {
        motif,
      },
      props: {
        document,
        documents: gods,
        navigation: {
          tree,
          backlinks: allDocuments.filter((d) =>
            d.data.links?.some((l) => l.href === document.data.permalink)
          ),
        },
        page: buildDocPage(document),
        tags: buildTags(
          document,
          allTags,
        ),
      }
    }
  });
}

export type KnowledgeGraphData = {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}

type KnowledgeGraphNode = {
  id: string;
  href?: string;
  title?: string;
  group?: string;
  radius: number;
}

type KnowledgeGraphLink = {
  source: string;
  target: string;
  value: number;
}

export const getGlobalKnowledgeGraph = async (slug?: string): Promise<KnowledgeGraphData> => {
  const nodes = new Map<string, KnowledgeGraphNode>();
  const links: KnowledgeGraphLink[] = [];

  const addToNodes = (id: string, group?: string, title?: string, href?: string) => {
    if (!nodes.has(id)) {
      nodes.set(id, {
        id,
        href,
        title,
        radius: 5,
        group,
      })
    } else {
      const node = nodes.get(id) as KnowledgeGraphNode;

      node.radius = node.radius + .3;
      node.title = node.title ?? title;
      node.group = node.group ?? group;
      node.href = node.href ?? href;
    }
  }

  const addToLinks = (source: string, target: string, value: number) => {
    links.push({
      source,
      target,
      value,
    })
  }

  for (const god of allGods) {
    const group = god?.data.tags?.find(t => t.startsWith('culture/'));

    const matchesSlug = !slug || god.id === slug || god.data.links?.some(l => l.id === slug);

    if (!matchesSlug) {
      continue;
    }


    addToNodes(god.id, group, god.data.title, god.data.permalink);

    for (const link of god.data.links ?? []) {
      const isSlugLink = !slug || god.id === slug || link.id === slug;

      if (link.id && link.href && isSlugLink) {
        addToLinks(god.id, link.id, 1);
        addToNodes(link.id, undefined, link.title, link.href);
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    links: Array.from(links.values()),
  }
}