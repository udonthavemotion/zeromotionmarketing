// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Use server output because the project includes API routes under `src/pages/api/*`.
  // This enables serverless functions on Vercel.
  output: "server",
  adapter: vercel({}),
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
