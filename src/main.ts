import {
  app,
  LogMessages,
  initEnv,
  getEnv,
  checkDatabaseConnections,
  checkValkeyConnection,
  stateConfig,
  valkey,
  verifySearchConnection,
  checkMinioConnection,
} from "~/core/config/";

// Graceful shutdown
const shutdown = async (signal: string) => {
  app.log.info(LogMessages.SERVER_SHUTDOWN(signal));
  try {
    await app.close();
    app.log.info(LogMessages.SERVER_CLOSED);
    process.exit(0);
  } catch (err) {
    app.log.error({ err }, LogMessages.SERVER_ERROR);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const main = async () => {
  initEnv();
  const env = getEnv();

  // Check database connections
  await checkDatabaseConnections();
  await checkValkeyConnection();
  await verifySearchConnection();
  await checkMinioConnection();

  // Initialize app state
  const cacheClient = await valkey();
  app.state = { ...stateConfig, cache: cacheClient };

  await app.listen({ port: env.SERVER_PORT, host: env.SERVER_HOST });
  app.log.info(LogMessages.SERVER_START(env.SERVER_HOST, env.SERVER_PORT));
};

main().catch((err) => {
  app.log.error({ err }, "Failed to start server");
  process.exit(1);
});
