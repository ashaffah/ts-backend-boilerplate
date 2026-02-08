import { signIn, signUp } from "../repositories/auth.repository";
import { hashPassword, verifyPassword } from "~/core/utils/";
import { AuthDto } from "../dtos/auth.dto";

export async function loginService({ email, password }: AuthDto) {
  const user = await signIn(email);
  if (!user) throw new Error("Invalid credentials");
  const valid = await verifyPassword(user.password, password);
  if (!valid) throw new Error("Invalid credentials");
  // Generate JWT/token here
  return { message: "Login successful" };
}

export async function registerService({ email, password }: AuthDto) {
  const hashed = await hashPassword(password);
  const user = await signUp({ email, password: hashed });
  return { message: "Register successful", user };
}
