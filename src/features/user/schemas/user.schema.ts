import { type } from "arktype";

export const UserSchema = type({
  email: "string.email",
  name: "string",
  password: "string >= 6",
});
