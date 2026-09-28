## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Retrospect

CS 개념을 공부하며 남긴 회고 노트 사이트 (Astro + Starlight). 개인 포트폴리오이자 복습용이다.

- 노트: `src/content/docs/<category>/<slug>.md`, 형식은 `templates/note.md`. 컴포넌트(`src/components/`)를 넣는 노트만 `.mdx`로 쓴다.
- 도식과 시각화의 색, 모서리 값은 `src/styles/tokens.css`의 역할 토큰(`--rs-*`)만 쓴다. 층층이 쌓인 구조 도식은 `src/styles/diagram.css`.
- 카테고리 목록: `src/categories.mjs`. 노트가 있는 카테고리만 사이드바와 홈에 자동으로 뜬다.
- frontmatter 확장 필드(`date`, `lastReviewed`, `tags`): `src/content.config.ts`
- 대화를 노트로 정리하는 방법: `.claude/skills/note/SKILL.md`
- 사이트의 글은 한국어로 쓴다.
