import { type } from "arktype";

export const UserSchema = type({
  id: "string.uuid",
  email: "string.email",
  name: "string",
  password: "string",
});
