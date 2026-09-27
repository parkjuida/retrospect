import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				/** 처음 공부한 날 */
				date: z.coerce.date().optional(),
				/** 마지막으로 복습한 날 */
				lastReviewed: z.coerce.date().optional(),
				tags: z.array(z.string()).default([]),
			}),
		}),
	}),
};
