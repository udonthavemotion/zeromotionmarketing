# ZeroMotion Site

Ultra-fast marketing site built with Astro + Tailwind + TypeScript.

## Setup

```bash
pnpm install
cp .env.example .env # add RESEND_API_KEY if emailing
pnpm dev
```

## Scripts

- dev: local dev server
- build: production build
- preview: preview production build
- lint: type & astro check

## Tech

- Astro (content-first, zero-JS by default)
- Tailwind v4
- Framer Motion (minimal islands)
- astro-icon + lucide

## Deploy (Vercel)

- Import repo in Vercel
- Framework preset: Astro
- Build command: `pnpm build`
- Output: `dist`
- Env: add RESEND_API_KEY (optional)

## Assets

All brand images are in `public/brand/`. Favicon at `public/favicon.svg`.

## API

POST `/api/lead` with JSON: { name, email, business, niche, message? }
Sends email via Resend (if configured). Saves JSON to `src/data/leads/` in dev.
