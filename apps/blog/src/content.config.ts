import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['published', 'draft']).default('published'),
    date: z.date(),
    updated: z.date().optional(),
  }),
});

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    parent: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  docs: docsCollection,
};
