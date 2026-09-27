# Retrospect

CS 개념을 공부하며 헷갈렸던 것, 직접 확인한 것, 내 말로 다시 정리한 것들을 모아두는 회고 노트 사이트.

[Astro](https://astro.build)와 [Starlight](https://starlight.astro.build)로 만들었다.

## 실행

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # ./dist 에 정적 사이트 생성
```

## 노트 쓰기

1. `templates/note.md`를 복사해서 `src/content/docs/<카테고리>/<영문-slug>.md`로 저장한다.
2. 새 카테고리가 필요하면 `src/categories.mjs`에 추가한다.
3. Claude Code에서 공부를 마친 뒤 **"노트로 정리해줘"**(또는 `/note`)라고 하면 템플릿에 맞춘 초안이 만들어진다. "한 줄 요약"과 "처음 가졌던 질문"은 직접 다듬기.

## 구조

```
src/
├── categories.mjs          # 카테고리 목록
├── content.config.ts       # frontmatter 스키마 (date, lastReviewed, tags)
├── components/PageTitle.astro  # 제목 아래 날짜·태그 표시
├── pages/
│   ├── index.astro         # 홈 (카테고리, 최근 노트)
│   └── tags/index.astro    # 태그별 모음
└── content/docs/<category>/*.md  # 노트
templates/note.md           # 노트 템플릿
.claude/skills/note/        # "노트로 정리해줘" 스킬
```
