import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    published: z.date(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('未分类'),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
