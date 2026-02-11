import { Client, type ClientOptions } from "minio";
import { getEnv } from "./env.validation";
import { logger, LogMessages } from "./logger.config";

const env = getEnv();

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
} as ClientOptions);

export async function checkMinioConnection(): Promise<boolean> {
  try {
    await minioClient.listBuckets();
    logger.info(LogMessages.MINIO_CONNECTION_SUCCESS);
    return true;
  } catch (error) {
    logger.error({ error }, LogMessages.MINIO_CONNECTION_FAILURE);
    return false;
  }
}
