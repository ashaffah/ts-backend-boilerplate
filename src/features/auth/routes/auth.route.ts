import { FastifyInstance } from "fastify";
import { loginController, registerController } from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", {}, loginController);
  app.post("/register", {}, registerController);
}
