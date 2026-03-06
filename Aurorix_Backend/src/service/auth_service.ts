/**
 * Authentication Service for Aurorix
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUserByProvider,
  createUser,
} from "../sql/auth_sql";
import type { User, LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from "../type";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-production";
const PASSWORD_SALT = process.env.PASSWORD_SALT || "default-salt";
const SALT_ROLL = parseInt(process.env.SALT_ROLL || "10", 10);

// Hash password with bcrypt + salt
export async function hashPassword(password: string): Promise<string> {
  const saltedPassword = password + PASSWORD_SALT;
  return bcrypt.hash(saltedPassword, SALT_ROLL);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const saltedPassword = password + PASSWORD_SALT;
  return bcrypt.compare(saltedPassword, hashedPassword);
}

// Generate JWT token
export function generateJwtToken(user: User): string {
  const payload: Omit<JwtPayload, "iat" | "exp"> = {
    userId: user.id,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// Login user
export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  const user = await getUserByUsername(credentials.username);

  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }

  if (!user.password) {
    return { success: false, message: "This account uses OAuth login" };
  }

  const isValidPassword = await verifyPassword(credentials.password, user.password);

  if (!isValidPassword) {
    return { success: false, message: "Invalid username or password" };
  }

  const token = generateJwtToken(user);

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        provider_id: user.provider_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    },
  };
}

// Register user
export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  // Check if username exists
  const existingUsername = await getUserByUsername(data.username);
  if (existingUsername) {
    return { success: false, message: "Username already exists" };
  }

  // Check if email exists (only if provided)
  if (data.email) {
    const existingEmail = await getUserByEmail(data.email);
    if (existingEmail) {
      return { success: false, message: "Email already registered" };
    }
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const user = await createUser({
    username: data.username,
    email: data.email || null,
    password: passwordHash,
    provider: "email",
    provider_id: null,
  });

  if (!user) {
    return { success: false, message: "Failed to create user" };
  }

  const token = generateJwtToken(user);

  return {
    success: true,
    message: "Registration successful",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        provider_id: user.provider_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    },
  };
}

// OAuth login/register
export async function oauthLogin(
  provider: "google" | "github",
  providerId: string,
  email: string,
  username: string
): Promise<AuthResponse> {
  // Check if user exists with this provider
  let user = await getUserByProvider(provider, providerId);

  if (!user) {
    // Check if email exists
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return { success: false, message: "Email already registered with different method" };
    }

    // Create new user
    user = await createUser({
      username,
      email,
      password: null,
      provider,
      provider_id: providerId,
    });

    if (!user) {
      return { success: false, message: "Failed to create user" };
    }
  }

  const token = generateJwtToken(user);

  return {
    success: true,
    message: "OAuth login successful",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        provider_id: user.provider_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    },
  };
}

// Get current user from token
export async function getCurrentUser(token: string): Promise<User | null> {
  const payload = verifyJwtToken(token);
  if (!payload) return null;

  return getUserById(payload.userId);
}
