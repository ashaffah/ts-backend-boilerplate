import "../../src/core/polyfills/bigint";
import { logger, stateConfig } from "../../src/core/config";

const prisma = stateConfig.prisma;

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
    logger.info("Helper disconnected successfully.");
  })
  .catch(async (err) => {
    logger.error("Running Helper failed: ", err);
    await prisma.$disconnect();
    process.exit(1);
  });
