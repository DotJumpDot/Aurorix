/**
 * Authentication SQL Queries for Aurorix
 */

import { supabase } from "../db";
import type { User } from "../type";

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserByProvider(
  provider: string,
  providerId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("provider", provider)
    .eq("provider_id", providerId)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function createUser(userData: {
  username: string;
  email: string | null;
  password: string | null;
  provider: string | null;
  provider_id: string | null;
}): Promise<User | null> {
  const { data, error } = await supabase.from("users").insert([userData]).select().single();

  if (error || !data) {
    console.error("Error creating user:", error);
    return null;
  }
  return data as User;
}

export async function updateUserPassword(userId: string, password: string): Promise<boolean> {
  const { error } = await supabase.from("users").update({ password }).eq("id", userId);

  return !error;
}
