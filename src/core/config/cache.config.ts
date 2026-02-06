import { GlideClient /** type IamAuthConfig */ } from "@valkey/valkey-glide";
import { logger, LogMessages } from "./logger.config";
import { getEnv } from "./env.validation";

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

export const valkey = async (): Promise<GlideClient> => {
  if (!valkeyInstance) {
    valkeyInstance = await GlideClient.createClient({
      addresses,
      credentials,
    });
  }
  return valkeyInstance;
};

export const checkValkeyConnection = async (): Promise<boolean> => {
  try {
    const client = await valkey();
    await client.ping();
    logger.info(LogMessages.VALKEY_CONNECTION_SUCCESS);
    return true;
  } catch (err) {
    logger.error({ err }, LogMessages.VALKEY_CONNECTION_FAILURE);
    return false;
  }
};
