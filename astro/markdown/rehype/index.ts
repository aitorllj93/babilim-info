import type { Element, ElementContent, Node, Text, Parent } from 'hast'
import { isElement } from '../utils/hast';

const URL_REGEX = /(?<!@)\b(?:https?:\/\/(?:[\w]*:[\w]*@)?)?[\w\-\.]+\.(?:com|org|co\.uk|net|de|com\.br|io|com\.au|it|fr|nl|co|in|ca|github\.io|co\.jp|ch|se|es|eu|edu|ai|be|me|us|blogspot\.com|jp|dk|ru|app|co\.za|dev|pl|co\.kr|co\.in|com\.mx|no|info|pt|fi|cn|cz|tech|org\.uk|ro|biz|ie|gov|co\.nz|com\.cn|xyz|com\.tr|gr|tv|mx|ae|at)\b(?:\/[\w.,?^=%&:\/~+#\-]*[\w?^=%&\/~+#\-])?/gim;

const captionChildren = (caption: string): ElementContent[] => {
  const matches = Array.from(caption.matchAll(URL_REGEX));

  if (matches.length === 0) {
    return [{
      type: 'text',
      value: caption,
    }];
  }

  let captionTpl = caption;
  const linkElements: Element[] = [];
  for (const match of matches) {
    const [url] = match;
    const urlObj = new URL(url);
    captionTpl = captionTpl.replace(url, '$$$_$$$');
    linkElements.push({
      type: 'element',
      tagName: 'a',
      properties: { href: url },
      children: [
        {
          type: 'text',
          value: urlObj.hostname,
        },
      ],
    })
  }

  return captionTpl.split('$$').map(text => {
    if (text === '') {
      return null;
    }

    if (text === '_') {
      return linkElements.shift();
    }

    return {
      type: 'text',
      value: text
    };
  }).filter(Boolean) as ElementContent[];
}

const imageToCaptionedFigure = (node: Element) => {
  const image = JSON.parse(JSON.stringify(node));
  const caption = node.properties.alt as string;
  const title = (node.properties.src as string).split('/').reverse()?.[0];

  if (!caption || caption === title) {
    return;
  }

  image.properties.alt = title;

  const captionElement: Element = {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
    children: captionChildren(caption),
  };

  node.tagName = 'figure';
  node.children = [
    image,
    captionElement,
  ];
}

const rewrite = (node: Node, index: number, parent: Parent) => {
  if (
    isElement(node) &&
    node.tagName === "pre" &&
    node.properties.dataLanguage === "plaintext"
  ) {
    node.children = [];
    const newNode = node as unknown as Text;
    newNode.type = "text";
    newNode.value = "";
  }

  if (isElement(node) && node.tagName === 'img') {
    imageToCaptionedFigure(node);
  }
};

export default {
  rewrite,
}