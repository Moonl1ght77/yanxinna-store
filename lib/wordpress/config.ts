import { z } from "zod";

const wordPressConfigSchema = z.object({
  WORDPRESS_API_URL: z.string().url(),
  WORDPRESS_REVALIDATE_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url()
});

export type WordPressConfig = z.infer<typeof wordPressConfigSchema>;

export function getWordPressConfig(): WordPressConfig {
  return wordPressConfigSchema.parse(process.env);
}
