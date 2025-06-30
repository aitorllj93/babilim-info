import { ObsidianDocumentSchema, ObsidianMdLoader, ObsidianWikiLinkSchema, } from "astro-loader-obsidian";
import { glob } from "astro/loaders";
import { defineCollection, z } from 'astro:content';

import { DOCUMENTS_COLLECTION_NAME, TAGS_COLLECTION_NAME } from './constants';

export const collections = {
	[DOCUMENTS_COLLECTION_NAME]: defineCollection({
		loader: ObsidianMdLoader({
			// author: config.author,
			base: 'src/content/vault',
			url: '',
			wikilinkFields: [
				'father',
				'mother',
				'siblings',
				'spouses',
				'offspring',
				'enemies',
				'allies',
				'cognates',
				'syncretics',
				'relateds',
			]
		}),
		schema: ({ image }) => ObsidianDocumentSchema.extend({
      image: image().optional(),
      // or
			subtitle: z.string().optional(),
      cover: image().optional(),
			'cover-x': z.number().optional(),
			'cover-y': z.number().optional(),
			order: z.number().optional(),
			relateds: ObsidianWikiLinkSchema.array().optional(),
			father: ObsidianWikiLinkSchema.optional(),
			mother: ObsidianWikiLinkSchema.optional(),
			siblings: ObsidianWikiLinkSchema.array().optional(),
			spouses: ObsidianWikiLinkSchema.array().optional(),
			offspring: ObsidianWikiLinkSchema.array().optional(),
			enemies: ObsidianWikiLinkSchema.array().optional(),
			allies: ObsidianWikiLinkSchema.array().optional(),
			cognates: ObsidianWikiLinkSchema.array().optional(),
			syncretics: ObsidianWikiLinkSchema.array().optional(),
			references: z.string().array().optional(),
    }),
	}),
	[TAGS_COLLECTION_NAME]: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./src/content/tags" }),
		schema:  ({ image }) => z.object({
			id: z.string(),
			name: z.string(),
			description: z.string().optional(),
			color: z.string().optional(),
			foreground: z.string().optional(),
			icon: z.string().optional(),
			type: z.enum(['Domain', 'Culture', 'Trait', 'Motif']).optional(),
      image: image().optional(),
		})
	}),
};
