import fm from "front-matter";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { readFile } from "node:fs/promises";
import json2md, { type TFrontMatter, type TFrontMatterVal } from "../utils/json2md";

export class KBRepository {
  constructor(private readonly cwd: string) {}

  public async addDocument(
    name: string,
    body = "",
    frontMatter: Record<string, string|string[]|undefined> = {}
  ) {

    return this.writeDocument(name, body, frontMatter);
  }

  public async getDocument(
    name: string
  ) {
    const {
      attributes,
      body,
    } = await this.readDocument(name);

    return {
      name,
      attributes,
      body,
    }
  }

  public async addTag(
    name: string,
    tag: string,
  ) {
    const {
      attributes,
      body,
      path,
    } = await this.readDocument(name);

    const alreadyExists = attributes.tags.includes(tag);

    if (alreadyExists) {
      return;
    }

    attributes.tags.push(tag);

    await this.writeDocument(name, body, attributes);
    
    return path;
  }

  public async updateThumbnail(
    name: string,
    thumbnail: string
  ) {
    const thumbnailPath = thumbnail.replace(`${this.cwd}/`, '');

    const {
      attributes,
      body,
      path,
    } = await this.readDocument<{
      cover: string;
      'cover-x': number;
      'cover-y': number;
    }>(name);

    attributes.cover = `[[${thumbnailPath}]]`;
    attributes['cover-x'] = 50;
    attributes['cover-y'] = 25;

    await this.writeDocument(name, body, attributes);
    
    return path;
  }

  private async writeDocument(
    name: string,
    body = "",
    frontMatter: Record<string, TFrontMatterVal|undefined> = {}
  ) {
    const path = this.resolvePath(name);

    const frontMatterArray: TFrontMatter[] = Object.entries(frontMatter)
      .filter(
        ([k, v]) => v !== undefined && (!Array.isArray(v) || v.length > 0)
      )
      .map(([k, v]) => ({ [k]: v })) as TFrontMatter[];

    const content = json2md({
      frontmatter: frontMatterArray,
      body,
    });

    await writeFile(path, content);

    return path;
  }

  private async readDocument<T = { tags: string[]; title: string; }>(
    name: string
  ) {
    const path = this.resolvePath(name);

    const content = await readFile(path, { encoding: 'utf-8' });
    const parsed = fm<T>(content);

    return {
      path,
      ...parsed
    }
  }

  private resolvePath(name: string) {
    const entryName = name.endsWith('.md') ? name.slice(0, -3) : name;
    const path = join(this.cwd, `${entryName}.md`);

    return path;
  }
}
