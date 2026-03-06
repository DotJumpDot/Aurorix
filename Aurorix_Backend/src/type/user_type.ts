/**
 * User Types for Aurorix
 */

import type { User } from "./auth_type";

export interface CreateUserRequest {
  username: string;
  email?: string;
  password: string;
  provider?: "google" | "github" | "email";
  providerId?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: Omit<User, "password">;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data?: Omit<User, "password">[];
}

export interface ApiKeyResponse {
  success: boolean;
  message: string;
  data?: {
    apiKey: string;
  };
}

export interface RegenerateApiKeyRequest {
  userId: string;
}
