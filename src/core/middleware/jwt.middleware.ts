import { app } from "../config";

type TokenPayload = {
  id: string;
  email?: string;
};

export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return app.jwt.sign(payload);
}

export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return app.jwt.sign(payload);
}
