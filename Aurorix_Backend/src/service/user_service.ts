/**
 * User Service for Aurorix
 */

import { getAllUsers, updateUser, deleteUser } from "../sql/user_sql";
import { hashPassword } from "./auth_service";
import type { User, UsersListResponse, UserResponse, UpdateUserRequest } from "../type";

// Get all users (admin function)
export async function getUsersList(): Promise<UsersListResponse> {
  const users = await getAllUsers();

  return {
    success: true,
    message: "Users retrieved successfully",
    data: users,
  };
}

// Get user by ID
export async function getUserByIdService(userId: string): Promise<UserResponse> {
  const users = await getAllUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    message: "User retrieved successfully",
    data: user,
  };
}

// Update user
export async function updateUserService(
  userId: string,
  updates: UpdateUserRequest
): Promise<UserResponse> {
  const updateData: {
    username?: string;
    email?: string;
    password?: string;
  } = {};

  if (updates.username) updateData.username = updates.username;
  if (updates.email) updateData.email = updates.email;
  if (updates.password) {
    updateData.password = await hashPassword(updates.password);
  }

  const user = await updateUser(userId, updateData);

  if (!user) {
    return { success: false, message: "Failed to update user" };
  }

  return {
    success: true,
    message: "User updated successfully",
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      provider: user.provider,
      provider_id: user.provider_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
}

// Delete user
export async function deleteUserService(userId: string): Promise<UserResponse> {
  const success = await deleteUser(userId);

  if (!success) {
    return { success: false, message: "Failed to delete user" };
  }

  return {
    success: true,
    message: "User deleted successfully",
  };
}
