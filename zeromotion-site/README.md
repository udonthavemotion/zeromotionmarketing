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

### Homepage Performance Notes

- Animated logo sources live under `public/brand/`.
  - Primary: `ZeroMotion-Transparent-OBS-v2.webm` (transparent, VP9).
  - Fallback: `ZeroMotion-Outline.png` (static).
- Replace or add new assets without changing code by keeping the same filenames, or update `src/components/TransparentLogo.astro` props.
- Regenerate responsive images with Astro assets where used; prefer widths: 360, 640, 828, 1080, 1440.
- Test reduced motion: in DevTools Rendering tab, enable `prefers-reduced-motion: reduce`. The logo video is hidden and a static image is shown.


## API

POST `/api/lead` with JSON: { name, email, business, niche, message? }
Sends email via Resend (if configured). Saves JSON to `src/data/leads/` in dev.
