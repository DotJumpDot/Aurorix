/**
 * User SQL Queries for Aurorix
 */

import { supabase } from "../db";
import type { User } from "../type";

export async function getAllUsers(): Promise<Omit<User, "password">[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email, provider, created_at, updated_at");

  if (error || !data) return [];
  return data as Omit<User, "password">[];
}

export async function updateUser(
  userId: string,
  updates: {
    username?: string;
    email?: string;
    password?: string;
  }
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating user:", error);
    return null;
  }
  return data as User;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  return !error;
}
