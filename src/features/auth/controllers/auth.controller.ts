import { FastifyRequest, FastifyReply } from "fastify";
import { loginService, registerService } from "../services/auth.service";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import { AuthDto } from "../dtos/auth.dto";

/**
 * EXAMPLES USAGE OF ARKTYPE WITH FASTIFY CONTROLLERS
 */
export async function loginController(req: FastifyRequest<{ Body: AuthDto }>, reply: FastifyReply) {
  const validation = LoginSchema(req.body);
  // check if validation failed
  if ("summary" in validation) {
    return reply.status(400).send({ error: validation.summary }); // It's better to use .summary instead of .problems for concise error messages
  }
  // After checking, validation is guaranteed not to be ArkErrors, so we can safely assert or assign to a typed variable
  const data = validation as AuthDto; // Or use a custom type guard for extra safety
  const result = await loginService(data); // Now no error because data is typed as AuthDto
  return reply.send(result);
}

export async function registerController(
  req: FastifyRequest<{ Body: AuthDto }>,
  reply: FastifyReply,
) {
  const validation = await RegisterSchema(req.body);
  if ("summary" in validation) {
    return reply.status(400).send({ error: validation.summary });
  }
  const data = validation as AuthDto;
  const result = await registerService(data);
  return reply.send(result);
}
