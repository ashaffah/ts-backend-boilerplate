import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  softDeleteUser,
  updateUser,
} from "../repositories/user.repository";
import { UserDto } from "../dtos/user.dto";
import type { QueryParams } from "~/core/types";

export async function getUserByIdService(id: string) {
  return await getUserById(id);
}

export async function getUsersService(params: QueryParams) {
  return await getUsers(params);
}

export async function createUserService(data: UserDto) {
  return await createUser(data);
}

export async function updateUserService(id: string, data: Partial<UserDto>) {
  return await updateUser(id, data);
}

export async function softDeleteUserService(id: string) {
  return await softDeleteUser(id);
}

export async function deleteUserService(id: string) {
  return await deleteUser(id);
}
