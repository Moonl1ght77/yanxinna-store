import type { z } from "zod";
import type { wordpressProductSchema } from "@/lib/wordpress/schemas";

export type WordPressProductResponse = z.infer<typeof wordpressProductSchema>;
