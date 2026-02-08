import { type } from "arktype";

export const LoginSchema = type({
  email: "string.email",
  password: "string",
});

export const RegisterSchema = type({
  email: "string.email",
  password: "string >= 6",
});
