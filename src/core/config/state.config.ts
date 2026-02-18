import { ExtendedPrismaClient, prisma, scylla } from "./database.config";
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
  prisma: ExtendedPrismaClient;
  scylla: typeof scylla;
  cache_redis: CacheTypes["cache_redis"];
  cache_valkey: CacheTypes["cache_valkey"];
  search: typeof searchClient;
  minio: typeof minioClient;
}

export const stateConfig: OmittedCacheState = {
  prisma,
  scylla,
  search: searchClient,
  minio: minioClient,
};

declare module "fastify" {
  interface FastifyInstance {
    state: AppState;
  }
}
