import { FastifyRequest, FastifyReply } from "fastify";
import { UserSchema } from "../schemas/user.schema";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  softDeleteUserService,
  updateUserService,
} from "../services/user.service";
import { UserDto } from "../dtos/user.dto";
import type { QueryParams } from "~/core/types/";

/**
 * EXAMPLES USAGE OF ARKTYPE WITH FASTIFY CONTROLLERS
 */
export async function getUserByIdController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = req.params;
  const result = await getUserByIdService(id);
  return reply.send(result);
}

export async function getUsersController(
  req: FastifyRequest<{ Querystring: QueryParams }>,
  reply: FastifyReply,
) {
  const params = req.query;
  const result = await getUsersService(params);
  return reply.send(result);
}

export async function createUserController(
  req: FastifyRequest<{ Body: UserDto }>,
  reply: FastifyReply,
) {
  const validation = UserSchema(req.body);
  if ("summary" in validation) {
    return reply.status(400).send({ error: validation.summary });
  }
  const data = validation as UserDto;
  const result = await createUserService(data);
  return reply.send(result);
}

export async function updateUserController(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<UserDto> }>,
  reply: FastifyReply,
) {
  const { id } = req.params;
  const data = req.body;
  const result = await updateUserService(id, data);
  return reply.send(result);
}

export async function softDeleteUserController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = req.params;
  const result = await softDeleteUserService(id);
  return reply.send(result);
}

export async function deleteUserController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = req.params;
  const result = await deleteUserService(id);
  return reply.send(result);
}
