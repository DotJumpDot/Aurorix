/**
 * Aurorix Backend - Main Entry Point
 * Character Frequency Analyzer API
 */

import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import * as dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { supabase, testConnection } from "./db";
import { authApi } from "./api/auth_api";
import { userApi } from "./api/user_api";
import { analysisApi } from "./api/analysis_api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const { FRONTEND_BASE_URL, PORT = 4200, API_KEY } = process.env;

// Validate required environment variables
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "JWT_SECRET", "PASSWORD_SALT"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(", ")}`);
}

const app = new Elysia()
  // CORS configuration
  .use(
    cors({
      origin: FRONTEND_BASE_URL
        ? [FRONTEND_BASE_URL]
        : ["http://localhost:4100", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-API-KEY"],
      credentials: true,
    })
  )
  // Swagger documentation
  .use(swagger({ path: "/w" }))
  // Health check endpoint
  .get("/health", async () => {
    const dbConnected = await testConnection();
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected",
      version: "1.0.0",
    };
  })
  // Test database endpoint
  .get("/test-db", async () => {
    try {
      const { data, error } = await supabase.from("users").select("id").limit(1);
      if (error) {
        return { error: "Database connection failed", details: error.message };
      }
      return { message: "Database connected", result: data };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: "Database connection failed", details: message };
    }
  })
  // API Routes
  .use(authApi)
  .use(userApi)
  .use(analysisApi)
  // Root endpoint
  .get("/", () => ({
    name: "Aurorix API",
    description: "Character Frequency Analyzer API",
    version: "1.0.0",
    docs: "/w",
    health: "/health",
  }))
  // Listen
  .listen(PORT);

// Start server
console.log(`🦊 Aurorix is running at http://localhost:${app.server?.port}`);
console.log(`🦊 Frontend URL: ${FRONTEND_BASE_URL || "http://localhost:4100"}`);
console.log(`🦊 Swagger UI: http://localhost:${app.server?.port}/w`);
