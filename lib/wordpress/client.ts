import { getWordPressConfig } from "@/lib/wordpress/config";

export class WordPressApiError extends Error {
  constructor(public readonly status: number) {
    super("WordPress API request failed");
    this.name = "WordPressApiError";
  }
}

type WordPressGetOptions = {
  tags: string[];
  searchParams?: Record<string, string | number | boolean | undefined>;
};

export async function wordPressGet<T>(
  path: string,
  { tags, searchParams = {} }: WordPressGetOptions
): Promise<T> {
  const { WORDPRESS_API_URL } = getWordPressConfig();
  const url = new URL(
    `${WORDPRESS_API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
  );

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300, tags }
  });

  if (!response.ok) {
    throw new WordPressApiError(response.status);
  }

  return (await response.json()) as T;
}
