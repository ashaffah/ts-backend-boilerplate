import { Prisma, PrismaClient } from "generated/prisma/client";
import { getEnv } from "./env.validation";
import { PrismaPg } from "@prisma/adapter-pg";
import { type ClientConfig } from "pg";
import cassandra, { ClientOptions, DseClientOptions } from "cassandra-driver";
import { logger, LogMessages } from "./logger.config";
import { NOW_EPOCH } from "~/core/constant";

const env = getEnv();

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString } as ClientConfig);

// Define the type for the parameters passed to the $allOperations middleware
type PrismaAllOperationsParams = {
  model?: Prisma.ModelName;
  operation: Prisma.PrismaAction;
  args: Record<string, unknown>;
  query: (_args: Record<string, unknown>) => Promise<never>;
};

/** Define a Prisma Client extension to automatically set the updatedAt field on update operations
 * FIX error TS2322
 * ref: https://github.com/prisma/prisma/issues/19888
 */
const timestampExtension = Prisma.defineExtension({
  name: "prisma-extension-auto-updatedAt",
  query: {
    $allModels: {
      /**
       * Middleware to automatically set updatedAt field on update operations
       * ref: https://www.prisma.io/docs/orm/prisma-client/client-extensions/query#modify-all-operations-in-all-models-of-your-schema
       */
      $allOperations(params) {
        const { operation, args, query } = params as PrismaAllOperationsParams;
        // logger.debug(`Prisma Query - Model Operation: ${operation}`);
        // logger.debug(`Prisma Query - Args: ${JSON.stringify(args)}`);
        // logger.debug(`Prisma Query - Original Query: ${query.toString()}`);
        // Automatically set updatedAt on update operations
        try {
          if (typeof operation === "string" && operation.includes("update")) {
            // logger.debug(`Setting updatedAt to ${nowEpoch} for ${operation} operation`);
            if (args && "data" in args && typeof args.data === "object" && args.data !== null) {
              // logger.debug(`Original data: ${JSON.stringify(args.data)}`);
              args.data = {
                ...args.data,
                updatedAt: NOW_EPOCH,
              };
            }
          }
          // Proceed with the original query
          return query(args);
        } catch (error) {
          logger.error({ error }, LogMessages.PRISMA_QUERY_ERROR);
          throw error;
        }
      },
    },
  },
});

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event" /**"stdout" || "event" */, level: "query" },
    { emit: "stdout" /**"stdout" || "event" */, level: "error" },
    { emit: "stdout" /**"stdout" || "event" */, level: "info" },
    { emit: "stdout" /**"stdout" || "event" */, level: "warn" },
  ],
  errorFormat: "minimal",
}).$extends(timestampExtension);

export type ExtendedPrismaClient = typeof prisma;

// Replace 'Username' and 'Password' with the username and password from your cluster settings
// let authProvider = new cassandra.auth.PlainTextAuthProvider('Username', 'Password');
// Replace the PublicIPs with the IP addresses of your clusters
const contactPoints = JSON.parse(env.SCYLLA_CONTACT_POINTS);
// Replace DataCenter with the name of your data center, for example: 'AWS_VPC_US_EAST_1'
const localDataCenter = env.SCYLLA_DATACENTER;
const keyspace = env.SCYLLA_KEYSPACE;

export const scylla = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: localDataCenter,
  keyspace: keyspace,
  // authProvider: authProvider,
} as ClientOptions | DseClientOptions);

export async function checkDatabaseConnections(): Promise<{
  postgres: boolean;
  scylla: boolean;
}> {
  const result = { postgres: false, scylla: false };

  // Check PostgreSQL
  try {
    await prisma.$connect();
    logger.info(LogMessages.POSTGRES_CONNECTION_SUCCESS);
    result.postgres = true;
  } catch (err) {
    logger.error({ err }, LogMessages.POSTGRES_CONNECTION_FAILURE);
  }

  // Check ScyllaDB
  try {
    await scylla.connect();
    logger.info(LogMessages.SCYLLA_CONNECTION_SUCCESS);
    result.scylla = true;
  } catch (err) {
    logger.error({ err }, LogMessages.SCYLLA_CONNECTION_FAILURE);
  }

  return result;
}
