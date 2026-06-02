// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

const isStatic = process.env.ASTRO_MODE === 'static';

export default defineConfig({
  output: isStatic ? 'static' : 'server',
  adapter: isStatic ? undefined : node({ mode: 'standalone' }),
  base: './',
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/admin': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:3000',
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
