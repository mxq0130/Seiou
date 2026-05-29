import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
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
