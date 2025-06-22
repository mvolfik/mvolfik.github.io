import { defineCollection, z } from "astro:content";

export const collections = {
  projects: defineCollection({
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        image: image().optional(),
        links: z.array(
          z.object({
            name: z.string(),
            href: z.string(),
          }),
        ),
        read_more: z.boolean().default(false),
        timespan: z.string(),
        ordering_value: z.number(),
        tags: z.array(z.string()),
        description: z.string(),
        archived: z.boolean().default(false),
      }),
  }),
};
