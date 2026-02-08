import { app } from "~/core/config/";
import type { QueryParams } from "~/core/types/";
import { UserDto } from "../dtos/user.dto";
import { HttpError } from "~/core/utils/";

export async function getUserById(id: string) {
  return app.state.prisma.user.findUnique({
    where: { id, deletedAt: null },
    omit: {
      password: true,
    },
  });
}

export async function getUsers(params: QueryParams) {
  const { page = "1", per_page = "10", search = "", sort = "createdAt", order = "asc" } = params;

  const take = parseInt(per_page ?? 20); // per_page
  const skip = (parseInt(page ?? 1) - 1) * take; // offset
  const orderBy = { [sort]: order };

  const users = await app.state.prisma.user.findMany({
    where: {
      OR: [{ email: { contains: search } }, { name: { contains: search } }],
      deletedAt: null,
    },
    orderBy,
    skip,
    take,
    omit: {
      password: true,
    },
  });

  const total = await app.state.prisma.user.count({
    where: {
      OR: [{ email: { contains: search } }, { name: { contains: search } }],
      deletedAt: null,
    },
  });

  return {
    data: users,
    meta: {
      total,
      page: parseInt(page),
      per_page: take,
      total_pages: Math.ceil(total / take),
    },
  };
}

export async function createUser(data: UserDto) {
  return app.state.prisma.user.create({
    data,
    omit: {
      password: true,
    },
  });
}

export async function updateUser(id: string, data: Partial<UserDto>) {
  return app.state.prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data,
    omit: {
      password: true,
    },
  });
}

export async function softDeleteUser(id: string) {
  const isUserExist = await app.state.prisma.user.findUnique({
    where: { id, deletedAt: null },
  });

  if (!isUserExist) {
    throw new HttpError("User not found", 404);
  }

  return app.state.prisma.user.update({
    where: {
      id,
    },
    data: { deletedAt: BigInt(Math.floor(Date.now() / 1000)) },
    omit: {
      password: true,
    },
  });
}

export async function deleteUser(id: string) {
  return app.state.prisma.user.delete({
    where: { id },
    omit: {
      password: true,
    },
  });
}
