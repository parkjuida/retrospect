// @ts-check
import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { categories } from './src/categories.mjs';

/** 해당 카테고리 폴더에 노트(.md/.mdx)가 하나라도 있는지 */
const hasNotes = (/** @type {string} */ slug) => {
	const dir = new URL(`./src/content/docs/${slug}/`, import.meta.url);
	return fs.existsSync(dir) && fs.readdirSync(dir).some((f) => /\.mdx?$/.test(f));
};

// https://astro.build/config
export default defineConfig({
	// GitHub Pages 주소: https://parkjuida.github.io/retrospect/
	site: 'https://parkjuida.github.io',
	base: '/retrospect',
	integrations: [
		starlight({
			title: 'Retrospect',
			description: 'CS 개념을 공부하며 남긴 회고 노트',
			defaultLocale: 'root',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			sidebar: [
				{ label: '태그로 보기', link: '/tags/' },
				...categories
					.filter((c) => hasNotes(c.slug))
					.map((c) => ({ label: c.label, items: [{ autogenerate: { directory: c.slug } }] })),
			],
		}),
	],
});
