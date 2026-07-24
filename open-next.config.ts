import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

// 不配 incrementalCache / tagCache 时 OpenNext 在 Cloudflare 上完全不缓存：
// lib/wordpress/client.ts 的 `next: { revalidate: 300, tags }` 会静默失效，
// 每个访客的每次访问都直接打 WordPress，/api/revalidate 也没有东西可刷。
// 两个实现都用 KV，绑定见 wrangler.jsonc（NEXT_INC_CACHE_KV / NEXT_TAG_CACHE_KV）。
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvTagCache
});
