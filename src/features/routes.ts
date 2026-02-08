import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth";
import { userRoutes } from "./user";

export function registerFeatureRoutes(app: FastifyInstance) {
  /**
   * ROUTES
   * Register feature routes here
   */
  authRoutes(app);
  userRoutes(app);
}
