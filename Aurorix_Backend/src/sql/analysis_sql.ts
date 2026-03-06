/**
 * Text Analysis SQL Queries for Aurorix
 */

import { supabase } from "../db";
import type { TextAnalysis, SavedResult } from "../type";

// Text Analyses
export async function createTextAnalysis(
  analysisData: Omit<TextAnalysis, "id" | "created_at" | "updated_at">
): Promise<TextAnalysis | null> {
  const { data, error } = await supabase
    .from("text_analyses")
    .insert([
      {
        user_id: analysisData.user_id,
        text_content: analysisData.text_content,
        text_hash: analysisData.text_hash,
        total_characters: analysisData.character_analysis.total_characters,
        unique_characters: analysisData.character_analysis.unique_characters,
        character_frequency: analysisData.character_analysis.character_frequency,
        uppercase_count: analysisData.character_analysis.uppercase_count,
        lowercase_count: analysisData.character_analysis.lowercase_count,
        digit_count: analysisData.character_analysis.digit_count,
        special_char_count: analysisData.character_analysis.special_char_count,
        total_words: analysisData.word_analysis.total_words,
        unique_words: analysisData.word_analysis.unique_words,
        word_frequency: analysisData.word_analysis.word_frequency,
        average_word_length: analysisData.word_analysis.average_word_length,
        flesch_reading_ease: analysisData.reading_level.flesch_reading_ease,
        flesch_kincaid_grade: analysisData.reading_level.flesch_kincaid_grade,
        smog_index: analysisData.reading_level.smog_index,
        coleman_liau_index: analysisData.reading_level.coleman_liau_index,
        automated_readability_index: analysisData.reading_level.automated_readability_index,
        language_detected: analysisData.language_detected,
        reading_time_seconds: analysisData.reading_time_seconds,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating text analysis:", error);
    return null;
  }

  return mapDatabaseToTextAnalysis(data);
}

export async function getTextAnalysisById(
  id: string,
  userId: string
): Promise<TextAnalysis | null> {
  const { data, error } = await supabase
    .from("text_analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return mapDatabaseToTextAnalysis(data);
}

export async function getTextAnalysisByHash(
  textHash: string,
  userId: string
): Promise<TextAnalysis | null> {
  const { data, error } = await supabase
    .from("text_analyses")
    .select("*")
    .eq("text_hash", textHash)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return mapDatabaseToTextAnalysis(data);
}

export async function getTextAnalysesByUserId(
  userId: string,
  limit = 50,
  offset = 0
): Promise<TextAnalysis[]> {
  const { data, error } = await supabase
    .from("text_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data.map(mapDatabaseToTextAnalysis);
}

export async function deleteTextAnalysis(id: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("text_analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  return !error;
}

// Saved Results
export async function createSavedResult(
  savedResultData: Omit<SavedResult, "id" | "created_at" | "updated_at">
): Promise<SavedResult | null> {
  const { data, error } = await supabase
    .from("saved_results")
    .insert([
      {
        user_id: savedResultData.user_id,
        analysis_id: savedResultData.analysis_id,
        title: savedResultData.title,
        description: savedResultData.description,
        tags: savedResultData.tags,
        export_data: savedResultData.export_data,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating saved result:", error);
    return null;
  }
  return data as SavedResult;
}

export async function getSavedResultsByUserId(userId: string): Promise<SavedResult[]> {
  const { data, error } = await supabase
    .from("saved_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as SavedResult[];
}

export async function getSavedResultById(id: string, userId: string): Promise<SavedResult | null> {
  const { data, error } = await supabase
    .from("saved_results")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as SavedResult;
}

export async function updateSavedResult(
  id: string,
  userId: string,
  updates: Partial<Pick<SavedResult, "title" | "description" | "tags">>
): Promise<SavedResult | null> {
  const { data, error } = await supabase
    .from("saved_results")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating saved result:", error);
    return null;
  }
  return data as SavedResult;
}

export async function deleteSavedResult(id: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("saved_results")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  return !error;
}

// Helper function to map database row to TextAnalysis type
function mapDatabaseToTextAnalysis(data: Record<string, unknown>): TextAnalysis {
  return {
    id: data.id as string,
    user_id: data.user_id as string,
    text_content: data.text_content as string,
    text_hash: data.text_hash as string,
    character_analysis: {
      total_characters: data.total_characters as number,
      unique_characters: data.unique_characters as number,
      character_frequency: (data.character_frequency as Record<string, number>) || {},
      uppercase_count: data.uppercase_count as number,
      lowercase_count: data.lowercase_count as number,
      digit_count: data.digit_count as number,
      special_char_count: data.special_char_count as number,
    },
    word_analysis: {
      total_words: data.total_words as number,
      unique_words: data.unique_words as number,
      word_frequency: (data.word_frequency as Record<string, number>) || {},
      average_word_length: data.average_word_length as number,
    },
    reading_level: {
      flesch_reading_ease: data.flesch_reading_ease as number | null,
      flesch_kincaid_grade: data.flesch_kincaid_grade as number | null,
      smog_index: data.smog_index as number | null,
      coleman_liau_index: data.coleman_liau_index as number | null,
      automated_readability_index: data.automated_readability_index as number | null,
    },
    language_detected: data.language_detected as string,
    reading_time_seconds: data.reading_time_seconds as number,
    created_at: data.created_at as string,
    updated_at: data.updated_at as string,
  };
}
