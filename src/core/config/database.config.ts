import { PrismaClient } from "generated/prisma/client";
import { getEnv } from "./env.validation";
import { PrismaPg } from "@prisma/adapter-pg";
import { type ClientConfig } from "pg";
import cassandra, { ClientOptions, DseClientOptions } from "cassandra-driver";
import { logger, LogMessages } from "./logger.config";

const env = getEnv();

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString } as ClientConfig);

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event" /**"stdout" || "event" */, level: "query" },
    { emit: "stdout" /**"stdout" || "event" */, level: "error" },
    { emit: "stdout" /**"stdout" || "event" */, level: "info" },
    { emit: "stdout" /**"stdout" || "event" */, level: "warn" },
  ],
  errorFormat: "minimal",
}).$extends({
  query: {
    $allModels: {
      /**
       * Middleware to automatically set updatedAt field on update operations
       */
      $allOperations: async ({ operation, args, query }) => {
        // logger.debug(`Prisma Query - Model Operation: ${operation}`);
        // logger.debug(`Prisma Query - Args: ${JSON.stringify(args)}`);
        // logger.debug(`Prisma Query - Original Query: ${query.toString()}`);
        // Automatically set updatedAt on update operations
        if (operation.includes("update")) {
          const nowEpoch = BigInt(Math.floor(Date.now() / 1000));
          // logger.debug(`Setting updatedAt to ${nowEpoch} for ${operation} operation`);
          if (args && "data" in args && typeof args.data === "object" && args.data !== null) {
            // logger.debug(`Original data: ${JSON.stringify(args.data)}`);
            args.data = {
              ...args.data,
              updatedAt: nowEpoch,
            };
          }
        }
        // Proceed with the original query
        return query(args);
      },
    },
  },
});

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

export const checkDatabaseConnections = async (): Promise<{
  postgres: boolean;
  scylla: boolean;
}> => {
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
};
