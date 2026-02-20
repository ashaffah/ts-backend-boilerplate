import { Client } from "@elastic/elasticsearch";
import { getEnv } from "./env.validation";
import { logger, LogMessages } from "./logger.config";

const env = getEnv();

export const searchClient = new Client({
  node: env.ELASTICSEARCH_NODE,
  auth: {
    username: env.ELASTICSEARCH_USERNAME,
    password: env.ELASTICSEARCH_PASSWORD,
    apiKey: env.ELASTICSEARCH_API_KEY,
    bearer: env.ELASTICSEARCH_BEARER_TOKEN,
  },
  requestTimeout: 30000,
  maxRetries: 3,
  sniffOnStart: false,
  sniffOnConnectionFault: false,
});

export async function verifySearchConnection(): Promise<boolean> {
  try {
    await searchClient.ping();
    logger.info(LogMessages.ELASTICSEARCH_CONNECTION_SUCCESS);
    return true;
  } catch (err) {
    logger.error({ err }, LogMessages.ELASTICSEARCH_CONNECTION_FAILURE);
    return false;
  }
}
