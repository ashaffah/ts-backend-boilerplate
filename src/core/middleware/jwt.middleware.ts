import { app } from "../config";

type TokenPayload = {
  id: string;
  email?: string;
};

export const signAccessToken = async (payload: TokenPayload): Promise<string> => {
  return app.jwt.sign(payload);
};

export const signRefreshToken = async (payload: TokenPayload): Promise<string> => {
  return app.jwt.sign(payload);
};
