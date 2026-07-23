import { z } from "zod";

const localeValuesSchema = z.object({
  "ru-RU": z.string().min(1),
  "en-US": z.string().min(1),
  "en-GB": z.string().min(1),
  "fr-FR": z.string().min(1),
  "de-DE": z.string().min(1)
});

const imageSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  alt: z.string()
});

const translationSchema = z.object({
  name: z.string().min(1),
  short_description: z.string().min(1),
  description: z.string().min(1),
  badge: z.string().optional().default(""),
  fabric: z.string().min(1),
  care: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(1),
  seo_title: z.string().min(1),
  seo_description: z.string().min(1)
});

export const wordpressProductSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  product_number: z.string().min(1),
  category: z.object({
    id: z.number().int().positive(),
    slug: z.string().min(1),
    name: z.string().min(1)
  }),
  subcategory: z
    .object({
      id: z.number().int().positive(),
      slug: z.string().min(1),
      name: z.string().min(1)
    })
    .nullable()
    .optional(),
  main_image: imageSchema,
  hover_image: imageSchema.nullable().optional(),
  gallery: z.array(imageSchema),
  sizes: z.array(z.object({ value: z.string().min(1) })).min(1),
  colors: z
    .array(
      z.object({
        names: localeValuesSchema,
        hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        image: imageSchema,
        hover_image: imageSchema
      })
    )
    .min(1),
  parameters: z.array(
    z.object({
      labels: localeValuesSchema,
      values: localeValuesSchema
    })
  ),
  attachments: z.array(
    z.object({
      id: z.number().int().positive(),
      url: z.string().url(),
      mime_type: z.string().min(1),
      labels: localeValuesSchema
    })
  ),
  compression_level: z.enum(["Light", "Medium", "Firm"]).nullable().optional(),
  featured: z.boolean(),
  best_seller: z.boolean(),
  sort_order: z.number().int(),
  complete_the_look: z.array(z.string().min(1)),
  translations: z.object({
    "ru-RU": translationSchema,
    "en-US": translationSchema,
    "en-GB": translationSchema,
    "fr-FR": translationSchema,
    "de-DE": translationSchema
  })
});

export const wordpressCategorySchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  parent: z.number().int().nonnegative()
});
