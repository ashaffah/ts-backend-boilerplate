import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth";

export function registerFeatureRoutes(app: FastifyInstance) {
  /**
   * ROUTES
   * Register feature routes here
   */
  authRoutes(app);
}
