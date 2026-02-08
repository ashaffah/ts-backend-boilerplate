import { FastifyInstance } from "fastify";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  softDeleteUserController,
  updateUserController,
} from "../controllers/user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users/:id", {}, getUserByIdController);
  app.get("/users", {}, getUsersController);
  app.post("/users", {}, createUserController);
  app.put("/users/:id", {}, updateUserController);
  app.patch("/users/:id/soft-delete", {}, softDeleteUserController);
  app.delete("/users/:id", {}, deleteUserController);
}
