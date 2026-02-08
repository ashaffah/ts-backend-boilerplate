import { app } from "~/core/config/";
import { AuthDto } from "../dtos/auth.dto";

export async function signIn(email: string) {
  return app.state.prisma.user.findUnique({
    where: { email },
  });
}

export async function signUp(data: AuthDto) {
  return app.state.prisma.user.create({
    data,
    omit: {
      password: true,
    },
  });
}
