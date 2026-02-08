import type { FastifyLoggerOptions } from "fastify";
import type { PinoLoggerOptions } from "fastify/types/logger";

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Custom logger configuration using Fastify's built-in Pino logger
 * Pino is one of the fastest JSON loggers for Node.js
 */
export const loggerConfig: FastifyLoggerOptions & PinoLoggerOptions = {
  level: (process.env.LOG_LEVEL as LogLevel) || (isDevelopment ? "debug" : "info"),

  // Pretty print for development, JSON for production
  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        ignore: "pid,hostname",
        singleLine: false,
        messageFormat: "{msg}",
      },
    },
  }),

  // Custom serializers for request/response
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
        path: request.routeOptions?.url,
        parameters: request.params,
        headers: isDevelopment ? request.headers : undefined,
      };
    },
    res(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
  },

  // Redact sensitive information
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "body.password", "body.token"],
    censor: "[REDACTED]",
  },
};

/**
 * Custom log messages for different contexts
 */
export const LogMessages = {
  // Server lifecycle
  SERVER_START: (host: string, port: number) => `Server listening on http://${host}:${port}`,
  SERVER_SHUTDOWN: (signal: string) => `${signal} received. Gracefully shutting down...`,
  SERVER_CLOSED: "Server closed successfully",
  SERVER_ERROR: "Server error",

  // PostgreSQL
  POSTGRES_CONNECTION_SUCCESS: "PostgreSQL connected successfully",
  POSTGRES_CONNECTION_FAILURE: "PostgreSQL connection failed",

  // ScyllaDB
  SCYLLA_CONNECTION_SUCCESS: "ScyllaDB connected successfully",
  SCYLLA_CONNECTION_FAILURE: "ScyllaDB connection failed",

  // Elasticsearch
  ELASTICSEARCH_CONNECTION_SUCCESS: "Elasticsearch connected successfully",
  ELASTICSEARCH_CONNECTION_FAILURE: "Elasticsearch connection failed",

  // Minio
  MINIO_CONNECTION_SUCCESS: "Minio connected successfully",
  MINIO_CONNECTION_FAILURE: "Minio connection failed",

  // Valkey
  VALKEY_CONNECTION_SUCCESS: "Valkey cache connected successfully",
  VALKEY_CONNECTION_FAILURE: "Valkey cache connection failed",

  // Request lifecycle
  REQUEST_RECEIVED: (method: string, url: string) => `${method} ${url} received`,
  REQUEST_COMPLETED: (method: string, url: string, statusCode: number, time: number) =>
    `${method} ${url} completed with status ${statusCode} in ${time}ms`,

  // Auth
  AUTH_SUCCESS: (userId: string) => `User authenticated: ${userId}`,
  AUTH_FAILED: "Authentication failed",

  // General
  INFO: (message: string) => `${message}`,
  WARNING: (message: string) => `${message}`,
  ERROR: (message: string) => `${message}`,
  DEBUG: (message: string) => `${message}`,
} as const;

/**
 * Logger helper for usage outside request context.
 * Use app.log inside request handlers.
 *
 * @example
 * // In service or utility files
 * import { logger } from "~/core/config/";
 *
 * logger.info("Application starting...");
 * logger.error({ err }, "Something went wrong");
 * logger.debug({ data }, "Debug info");
 *
 * // Child logger with context
 * const dbLogger = logger.child({ service: "database" });
 * dbLogger.info("Connected to database");
 */
import pino from "pino";

export const logger = pino(loggerConfig);
