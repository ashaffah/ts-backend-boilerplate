import { GlideClient /** type IamAuthConfig */ } from "@valkey/valkey-glide";
import { logger, LogMessages } from "./logger.config";
import { getEnv } from "./env.validation";
import { createClient, type RedisClientOptions } from "redis";

const env = getEnv();

const addresses = [
  {
    host: env.VALKEY_HOST,
    port: env.VALKEY_PORT,
  },
];

const credentials = {
  username: env.VALKEY_USERNAME,
  password: env.VALKEY_PASSWORD,
  // iamConfig: {} as IamAuthConfig,
};

let valkeyInstance: GlideClient | null = null;

export async function createValkeyClient(): Promise<GlideClient> {
  if (!valkeyInstance) {
    valkeyInstance = await GlideClient.createClient({
      addresses,
      credentials,
    });
  }
  return valkeyInstance;
}

export async function checkValkeyConnection(): Promise<boolean> {
  try {
    const client = await createValkeyClient();
    await client.ping();
    logger.info(LogMessages.VALKEY_CONNECTION_SUCCESS);
    return true;
  } catch (err) {
    logger.error({ err }, LogMessages.VALKEY_CONNECTION_FAILURE);
    return false;
  }
}

const redisOptions: RedisClientOptions = {
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
  password: env.REDIS_PASSWORD,
};

export async function createRedisClient() {
  const client = createClient(redisOptions);
  await client.connect(); // Ensure connection is established
  return client;
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const client = await createRedisClient();
    await client.ping();
    logger.info(LogMessages.REDIS_CONNECTION_SUCCESS);
    await client.quit();
    return true;
  } catch (err) {
    logger.error({ err }, LogMessages.REDIS_CONNECTION_FAILURE);
    return false;
  }
}
