import type { CollectionEntry } from "astro:content";
import websiteConfig from "../../website.config";
import BabylonPicture from "../assets/Babylon.jpg";
import type { DocumentContext, PageContext } from "../types";

const shortenText = (text: string, length: number) => {
  if (text.length > length) {
    return `${text.substring(0, length - 3)}...`;
  }
  return text;
}

export const buildIndexPage = (language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${websiteConfig.title} - ${websiteConfig.description}`;
  const description = websiteConfig.seo.description;
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = BabylonPicture.src;
  const siteName = websiteConfig.title;

  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}

export const buildMythemesIndexPage = (language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${websiteConfig.title} - Mythemes Index`;
  const description = websiteConfig.seo.description;
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = BabylonPicture.src;
  const siteName = websiteConfig.title;

  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}

export const buildGodsIndexPage = (language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${websiteConfig.title} - Gods Index`;

  const description = websiteConfig.seo.description;
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = BabylonPicture.src;
  const siteName = websiteConfig.title;

  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}

export const buildDocPage = (doc: DocumentContext, language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${doc?.data.title ?? websiteConfig.title}${doc.data.subtitle ? ` - ${doc.data.subtitle}` : ''}`;
  const docDescription = doc?.data.description ?? websiteConfig.seo.description;


  const description = docDescription && shortenText(docDescription, 160);
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = doc?.data.cover?.src;
  const siteName = websiteConfig.title;


  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}

export const buildTagsIndexPage = (language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${websiteConfig.title} - Tags Index`;
  const description = websiteConfig.seo.description;
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = BabylonPicture.src;
  const siteName = websiteConfig.title;


  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}

export const buildTagPage = (tag: CollectionEntry<'tags'>, language = websiteConfig.defaultLanguage): PageContext => {
  const title = `${websiteConfig.title} - ${tag?.data.name}`;
  const tagDescription = tag?.data.description ?? tag?.data.description ?? websiteConfig.seo.description;

  const description = tagDescription && shortenText(tagDescription, 160);
  const keywords = websiteConfig.seo.keywords.join(', ');
  const image = tag?.data.image?.src;
  const siteName = websiteConfig.title;


  return {
    title,
    language,
    seo: {
      title,
      description,
      keywords,
      image,
      openGraph: {
        description,
        image,
        title,
        siteName,
      },
      twitter: {
        description,
        image,
        title,
      },
    }
  }
}
