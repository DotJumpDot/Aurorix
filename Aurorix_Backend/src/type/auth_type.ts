/**
 * Authentication Types for Aurorix
 */

export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string | null;
  provider: "google" | "github" | "email" | null;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContext {
  user: User | null;
  token: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
}

export interface OAuthRequest {
  provider: "google" | "github";
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, "password">;
    token: string;
  };
}

export interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface ApiKeyPayload {
  userId: string;
  apiKey: string;
}
