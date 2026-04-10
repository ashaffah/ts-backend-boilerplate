import "../../src/core/polyfills/bigint";
import { logger } from "../../src/core/config";

async function main() {}

main().catch((err) => {
  logger.error("Error in helper: ", err);
  process.exit(1);
});
