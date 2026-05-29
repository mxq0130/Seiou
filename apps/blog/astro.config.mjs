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
    server: {
      proxy: {
        '/admin': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    syntaxHighlight: false,
  },

  server: { port: 4321 },
});
