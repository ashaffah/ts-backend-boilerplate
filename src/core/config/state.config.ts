import { prisma, scylla } from "./database.config";
import { GlideClient } from "@valkey/valkey-glide";
import { searchClient } from "./search.config";
import { minioClient } from "./storage.config";

interface AppState {
  prisma: typeof prisma;
  scylla: typeof scylla;
  cache: GlideClient;
  search: typeof searchClient;
  minio: typeof minioClient;
}

export const stateConfig: Omit<AppState, "cache"> & {
  cache?: GlideClient;
} = {
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
