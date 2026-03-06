/**
 * Analysis API Routes for Aurorix
 */

import { Elysia, t } from "elysia";
import { getCurrentUser } from "../service/auth_service";
import {
  analyzeText,
  getAnalysisHistory,
  getAnalysis,
  removeAnalysis,
  saveResult,
  getSavedResults,
  updateSavedResultService,
  deleteSavedResultService,
} from "../service/analysis_service";
import type { AnalyzeTextRequest, SaveResultRequest } from "../type";

// Helper to get user from request
async function getAuthenticatedUser(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const user = await getCurrentUser(token);
  return user?.id || null;
}

export const analysisApi = new Elysia({ prefix: "/analysis" })

  // Analyze text (protected)
  .post(
    "/analyze",
    async ({ request, body }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      const analyzeRequest = body as AnalyzeTextRequest;
      return await analyzeText(userId, analyzeRequest);
    },
    {
      body: t.Object({
        text: t.String({ minLength: 1 }),
        save: t.Optional(t.Boolean()),
      }),
    }
  )

  // Get analysis history (protected)
  .get("/history", async ({ request, query }) => {
    const userId = await getAuthenticatedUser(request);
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const limit = parseInt(query.limit as string) || 50;
    const offset = parseInt(query.offset as string) || 0;

    return await getAnalysisHistory(userId, limit, offset);
  })

  // Get single analysis (protected)
  .get(
    "/:id",
    async ({ params, request }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      return await getAnalysis(params.id, userId);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Delete analysis (protected)
  .delete(
    "/:id",
    async ({ params, request }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      return await removeAnalysis(params.id, userId);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Save result (protected)
  .post(
    "/save",
    async ({ request, body }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      const saveRequest = body as SaveResultRequest;
      return await saveResult(userId, saveRequest);
    },
    {
      body: t.Object({
        analysis_id: t.String(),
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        tags: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // Get saved results (protected)
  .get("/saved", async ({ request }) => {
    const userId = await getAuthenticatedUser(request);
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    return await getSavedResults(userId);
  })

  // Update saved result (protected)
  .put(
    "/saved/:id",
    async ({ params, request, body }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      return await updateSavedResultService(
        params.id,
        userId,
        body as {
          title?: string;
          description?: string;
          tags?: string[];
        }
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        tags: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // Delete saved result (protected)
  .delete(
    "/saved/:id",
    async ({ params, request }) => {
      const userId = await getAuthenticatedUser(request);
      if (!userId) {
        return { success: false, message: "Unauthorized" };
      }

      return await deleteSavedResultService(params.id, userId);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
