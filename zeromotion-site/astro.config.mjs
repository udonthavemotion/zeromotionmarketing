// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
// vercel adapter is only needed for server output on Vercel

// https://astro.build/config
export default defineConfig({
  // Local build: static for fast, portable output
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});