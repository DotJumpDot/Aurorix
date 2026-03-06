/**
 * User API Routes for Aurorix
 */

import { Elysia, t } from "elysia";
import { getCurrentUser } from "../service/auth_service";
import { getUsersList, updateUserService, deleteUserService } from "../service/user_service";

export const userApi = new Elysia({ prefix: "/users" })
  // Get all users (admin)
  .get("/", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Unauthorized" };
    }

    const token = authHeader.substring(7);
    const currentUser = await getCurrentUser(token);

    if (!currentUser) {
      return { success: false, message: "Invalid token" };
    }

    // TODO: Check if user is admin
    return await getUsersList();
  })

  // Get user by ID (protected)
  .get(
    "/:id",
    async ({ params, request }) => {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { success: false, message: "Unauthorized" };
      }

      const token = authHeader.substring(7);
      const currentUser = await getCurrentUser(token);

      if (!currentUser) {
        return { success: false, message: "Invalid token" };
      }

      // Users can only view their own profile
      if (currentUser.id !== params.id) {
        return { success: false, message: "Access denied" };
      }

      return {
        success: true,
        message: "User retrieved",
        data: {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          provider: currentUser.provider,
          provider_id: currentUser.provider_id,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
        },
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Update user (protected) - allows adding email after login
  .put(
    "/:id",
    async ({ params, body, request }) => {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { success: false, message: "Unauthorized" };
      }

      const token = authHeader.substring(7);
      const currentUser = await getCurrentUser(token);

      if (!currentUser) {
        return { success: false, message: "Invalid token" };
      }

      // Users can only update their own profile
      if (currentUser.id !== params.id) {
        return { success: false, message: "Access denied" };
      }

      return await updateUserService(
        params.id,
        body as {
          username?: string;
          email?: string;
          password?: string;
        }
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        username: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
        email: t.Optional(t.String({ format: "email" })),
        password: t.Optional(t.String({ minLength: 4 })),
      }),
    }
  )

  // Delete user (protected)
  .delete(
    "/:id",
    async ({ params, request }) => {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { success: false, message: "Unauthorized" };
      }

      const token = authHeader.substring(7);
      const currentUser = await getCurrentUser(token);

      if (!currentUser) {
        return { success: false, message: "Invalid token" };
      }

      // Users can only delete their own account
      if (currentUser.id !== params.id) {
        return { success: false, message: "Access denied" };
      }

      return await deleteUserService(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
