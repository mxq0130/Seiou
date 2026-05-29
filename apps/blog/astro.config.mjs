// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const isStatic = process.env.ASTRO_MODE === 'static';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: isStatic ? 'static' : 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    syntaxHighlight: false, // 关闭默认高亮，使用 Expressive Code
  },

  server: { port: 4321 },
});
