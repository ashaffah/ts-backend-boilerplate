import "dotenv/config";
import { type } from "arktype";
import { logger } from "./logger.config";

const EnvSchema = type({
  NODE_ENV: "'development' | 'production' | 'test' = 'development'",
  SERVER_PORT: "string.numeric.parse = '8080'",
  SERVER_HOST: "string = '0.0.0.0'",

  // PostgreSQL
  DATABASE_URL: "string",

  // ScyllaDB
  SCYLLA_CONTACT_POINTS: "string",
  SCYLLA_DATACENTER: "string",
  SCYLLA_KEYSPACE: "string",
  "SCYLLA_USERNAME?": "string",
  "SCYLLA_PASSWORD?": "string",

  // Cache / Valkey
  VALKEY_HOST: "string",
  VALKEY_PORT: "string.numeric.parse",
  VALKEY_USERNAME: "string",
  VALKEY_PASSWORD: "string",

  // Redis
  REDIS_HOST: "string",
  REDIS_PORT: "string.numeric.parse",
  REDIS_PASSWORD: "string",

  // Elasticsearch
  ELASTICSEARCH_NODE: "string",
  ELASTICSEARCH_USERNAME: "string",
  ELASTICSEARCH_PASSWORD: "string",
  "ELASTICSEARCH_API_KEY?": "string",
  "ELASTICSEARCH_BEARER_TOKEN?": "string",

  // MINIO
  MINIO_ENDPOINT: "string",
  MINIO_PORT: "string.numeric.parse",
  MINIO_ACCESS_KEY: "string",
  MINIO_SECRET_KEY: "string",
  MINIO_USE_SSL: type("'true' | 'false' | boolean").pipe((val) => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    throw new Error("MINIO_USE_SSL must be 'true' or 'false'");
  }),

  // Logging
  "LOG_LEVEL?": "'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'",

  // Auth
  SECRET_KEY: "string >= 32", // Minimum 32 characters
  "COOKIE_SECRET?": "string",
});

type Env = typeof EnvSchema.infer;

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvValidationError";
  }
}

let env: Env | null = null;
let initialized = false;

export const initEnv = (): Env => {
  if (initialized && env) {
    return env;
  }

  const parseResult = EnvSchema(process.env);

  if (parseResult instanceof type.errors) {
    const errorMessages = parseResult.map((e) => `  - ${e.path}: ${e.message}`).join("\n");
    throw new EnvValidationError(`Environment validation failed:\n${errorMessages}`);
  }

  logger.info("Environment variables validated successfully.");

  env = parseResult;
  initialized = true;
  return env;
};

export const getEnv = (): Env => {
  if (!initialized || !env) {
    return initEnv();
  }
  return env;
};
