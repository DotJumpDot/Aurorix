/**
 * Database connection for Aurorix
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️  Supabase credentials not found in environment variables");
}

export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseServiceKey || "mock-key"
);

// Helper to test connection
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.error("Database connection error:", error.message);
      return false;
    }
    console.log("✅ Database connected successfully");
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
}
