// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()],

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },
});