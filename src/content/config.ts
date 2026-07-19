import { defineCollection, z } from 'astro:content';

const commonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date().optional(),
  thumbnail: z.string().optional(),
  templateKey: z.string().optional(),
  // Add other fields as discovered
  image: z.string().optional(),
  featuredimage: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  number: z.number().optional(),
  pagetype: z.array(z.string()).optional(),
  category: z.string().optional(),
  photos: z
    .array(
      z.object({
        image: z.string(),
        caption: z.string().optional(),
        thumbnail: z.boolean().optional(),
      })
    )
    .optional(),
}).partial();

const work = defineCollection({
  type: 'content',
  schema: commonSchema,
});

const pages = defineCollection({
  type: 'content',
  schema: commonSchema,
});

export const collections = {
  work,
  pages,
};
