/**
 * Auth API Routes for Aurorix
 */

import { Elysia, t } from "elysia";
import { loginUser, registerUser, getCurrentUser } from "../service/auth_service";
import type { LoginRequest, RegisterRequest } from "../type";

export const authApi = new Elysia({ prefix: "/auth" })
  // Login
  .post(
    "/login",
    async ({ body }) => {
      const credentials = body as LoginRequest;
      return await loginUser(credentials);
    },
    {
      body: t.Object({
        username: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )

  // Register
  .post(
    "/register",
    async ({ body }) => {
      const data = body as RegisterRequest;
      return await registerUser(data);
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 50 }),
        email: t.Optional(t.String({ format: "email" })),
        password: t.String({ minLength: 4 }),
      }),
    }
  )

  // Get current user (protected)
  .get("/me", async ({ request }) => {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Unauthorized" };
    }

    const token = authHeader.substring(7);
    const user = await getCurrentUser(token);

    if (!user) {
      return { success: false, message: "Invalid token" };
    }

    return {
      success: true,
      message: "User retrieved",
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
  });
