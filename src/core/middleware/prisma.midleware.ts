import { app } from "../config";

app.state.prisma.$extends({
  query: {
    $allModels: {
      $allOperations: async ({ operation, args, query }) => {
        // Automatically set updatedAt on update operations
        if (operation.includes("update")) {
          const nowEpoch = BigInt(Math.floor(Date.now() / 1000));
          if (args && "data" in args && typeof args.data === "object" && args.data !== null) {
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
