import { getPrisma, getScylla } from "./database.config";
import { GlideClient } from "@valkey/valkey-glide";
import { searchClient } from "./search.config";
import { minioClient } from "./storage.config";
import { createRedisClient } from "./cache.config";

type CacheTypes = {
  cache_redis: Awaited<ReturnType<typeof createRedisClient>>;
  cache_valkey: GlideClient;
};

type OmittedCacheState = Omit<AppState, keyof CacheTypes>;

interface AppState {
  prisma: ReturnType<typeof getPrisma>;
  scylla: ReturnType<typeof getScylla>;
  cache_redis: CacheTypes["cache_redis"];
  cache_valkey: CacheTypes["cache_valkey"];
  search: typeof searchClient;
  minio: typeof minioClient;
}

export const stateConfig: OmittedCacheState = {
  prisma: getPrisma(),
  scylla: getScylla(),
  search: searchClient,
  minio: minioClient,
};

declare module "fastify" {
  interface FastifyInstance {
    state: AppState;
  }
}
