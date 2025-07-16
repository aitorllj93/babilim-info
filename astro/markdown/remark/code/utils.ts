
import type { Element, Node, Properties } from 'hast';
import { fromMarkdown } from "mdast-util-from-markdown";
import { isText } from '../../utils/hast';

export { fromMarkdown };

export const mdast2Tree = (mdast: Node, properties: Properties = {}) => {
  if (isText(mdast)) {
    return mdast;
  }

  const result = mdast as Element;

  result.tagName = mdast.type;
  result.type = "element";
  result.properties = properties;

  if (result.tagName === "root") {
    result.tagName = "div";
  }

  if (result.tagName === "link") {
    result.tagName = "a";
    result.properties = {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      href: (result as any).url,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      title: (result as any).title,
    };
  }

  if (result.tagName === "list") {
    result.tagName = "ul";
  }

  if (result.tagName === "listItem") {
    result.tagName = "li";
  }

  if (result.tagName === "paragraph") {
    result.tagName = "p";
  }

  if (result.children) {
    result.children.map((c) => mdast2Tree(c));
  }

  return result;
};