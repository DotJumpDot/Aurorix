/**
 * Text Analysis Service for Aurorix
 */

import { createHash } from "crypto";
import {
  createTextAnalysis,
  getTextAnalysisById,
  getTextAnalysesByUserId,
  deleteTextAnalysis,
  createSavedResult,
  getSavedResultsByUserId,
  getSavedResultById,
  updateSavedResult,
  deleteSavedResult,
} from "../sql/analysis_sql";
import type {
  TextAnalysis,
  SavedResult,
  AnalyzeTextRequest,
  AnalyzeTextResponse,
  SaveResultRequest,
  SavedResultResponse,
  SavedResultsListResponse,
  AnalysisHistoryResponse,
  CharacterAnalysis,
  WordAnalysis,
  ReadingLevel,
} from "../type";

// Calculate character analysis
function analyzeCharacters(text: string): CharacterAnalysis {
  const chars = Array.from(text);
  const frequency: Record<string, number> = {};
  let uppercaseCount = 0;
  let lowercaseCount = 0;
  let digitCount = 0;
  let specialCharCount = 0;

  for (const char of chars) {
    // Frequency
    frequency[char] = (frequency[char] || 0) + 1;

    // Categories
    if (/[A-Z]/.test(char)) uppercaseCount++;
    else if (/[a-z]/.test(char)) lowercaseCount++;
    else if (/\d/.test(char)) digitCount++;
    else if (/\S/.test(char)) specialCharCount++;
  }

  return {
    total_characters: chars.length,
    unique_characters: Object.keys(frequency).length,
    character_frequency: frequency,
    uppercase_count: uppercaseCount,
    lowercase_count: lowercaseCount,
    digit_count: digitCount,
    special_char_count: specialCharCount,
  };
}

// Calculate word analysis
function analyzeWords(text: string): WordAnalysis {
  // Split by whitespace and filter empty strings
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const frequency: Record<string, number> = {};
  let totalLength = 0;

  for (const word of words) {
    // Remove punctuation for word counting
    const cleanWord = word.replace(/[^\w]/g, "");
    if (cleanWord.length > 0) {
      frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
      totalLength += cleanWord.length;
    }
  }

  const uniqueWords = Object.keys(frequency).length;
  const totalWords = words.length;

  return {
    total_words: totalWords,
    unique_words: uniqueWords,
    word_frequency: frequency,
    average_word_length: totalWords > 0 ? totalLength / totalWords : 0,
  };
}

// Calculate reading level metrics
function calculateReadingLevel(text: string, wordCount: number): ReadingLevel {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const syllables = estimateSyllables(text);
  const characters = text.replace(/\s/g, "").length;
  const letters = text.replace(/[^a-zA-Z]/g, "").length;

  // Avoid division by zero
  const safeSentences = Math.max(sentences, 1);
  const safeWordCount = Math.max(wordCount, 1);

  // Flesch Reading Ease
  const fleschReadingEase =
    206.835 - 1.015 * (wordCount / safeSentences) - 84.6 * (syllables / safeWordCount);

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade =
    0.39 * (wordCount / safeSentences) + 11.8 * (syllables / safeWordCount) - 15.59;

  // SMOG Index (simplified - needs 30+ sentences for accuracy)
  const polysyllables = countPolysyllables(text);
  const smogIndex = 1.043 * Math.sqrt(polysyllables * (30 / safeSentences)) + 3.1291;

  // Coleman-Liau Index
  const colemanLiauIndex =
    0.0588 * ((letters / safeWordCount) * 100) - 0.296 * ((safeSentences / wordCount) * 100) - 15.8;

  // Automated Readability Index
  const automatedReadabilityIndex =
    4.71 * (characters / safeWordCount) + 0.5 * (safeWordCount / safeSentences) - 21.43;

  return {
    flesch_reading_ease: Math.round(fleschReadingEase * 100) / 100,
    flesch_kincaid_grade: Math.round(fleschKincaidGrade * 100) / 100,
    smog_index: Math.round(smogIndex * 100) / 100,
    coleman_liau_index: Math.round(colemanLiauIndex * 100) / 100,
    automated_readability_index: Math.round(automatedReadabilityIndex * 100) / 100,
  };
}

// Estimate syllable count
function estimateSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let count = 0;

  for (const word of words) {
    count += countSyllablesInWord(word);
  }

  return count;
}

// Count syllables in a single word
function countSyllablesInWord(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Count polysyllabic words (3+ syllables)
function countPolysyllables(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let count = 0;

  for (const word of words) {
    if (countSyllablesInWord(word) >= 3) {
      count++;
    }
  }

  return count;
}

// Calculate reading time (average 200 WPM)
function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute) * 60;
}

// Generate text hash
function generateTextHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

// Analyze text
export async function analyzeText(
  userId: string,
  request: AnalyzeTextRequest
): Promise<AnalyzeTextResponse> {
  try {
    const { text, save = false } = request;

    if (!text || text.trim().length === 0) {
      return { success: false, message: "Text is required" };
    }

    // Perform analyses
    const characterAnalysis = analyzeCharacters(text);
    const wordAnalysis = analyzeWords(text);
    const readingLevel = calculateReadingLevel(text, wordAnalysis.total_words);
    const readingTime = calculateReadingTime(wordAnalysis.total_words);
    const textHash = generateTextHash(text);

    const analysisData: Omit<TextAnalysis, "id" | "created_at" | "updated_at"> = {
      user_id: userId,
      text_content: text.substring(0, 10000), // Limit stored text
      text_hash: textHash,
      character_analysis: characterAnalysis,
      word_analysis: wordAnalysis,
      reading_level: readingLevel,
      language_detected: "en",
      reading_time_seconds: readingTime,
    };

    let savedAnalysis: TextAnalysis | null = null;

    // Save to database if requested
    if (save) {
      savedAnalysis = await createTextAnalysis(analysisData);
    }

    // Return analysis result
    const result: TextAnalysis = savedAnalysis || {
      id: "temp-" + Date.now(),
      ...analysisData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: "Text analyzed successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);
    return { success: false, message: "Failed to analyze text" };
  }
}

// Get analysis history
export async function getAnalysisHistory(
  userId: string,
  limit = 50,
  offset = 0
): Promise<AnalysisHistoryResponse> {
  const analyses = await getTextAnalysesByUserId(userId, limit, offset);

  return {
    success: true,
    message: "Analysis history retrieved",
    data: analyses,
  };
}

// Get single analysis
export async function getAnalysis(
  analysisId: string,
  userId: string
): Promise<AnalyzeTextResponse> {
  const analysis = await getTextAnalysisById(analysisId, userId);

  if (!analysis) {
    return { success: false, message: "Analysis not found" };
  }

  return {
    success: true,
    message: "Analysis retrieved",
    data: analysis,
  };
}

// Delete analysis
export async function removeAnalysis(
  analysisId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const success = await deleteTextAnalysis(analysisId, userId);

  return {
    success,
    message: success ? "Analysis deleted" : "Failed to delete analysis",
  };
}

// Save result
export async function saveResult(
  userId: string,
  request: SaveResultRequest
): Promise<SavedResultResponse> {
  const { analysis_id, title, description, tags = [] } = request;

  // Get the analysis
  const analysis = await getTextAnalysisById(analysis_id, userId);
  if (!analysis) {
    return { success: false, message: "Analysis not found" };
  }

  const savedResult = await createSavedResult({
    user_id: userId,
    analysis_id,
    title: title || null,
    description: description || null,
    tags,
    export_data: analysis,
  });

  if (!savedResult) {
    return { success: false, message: "Failed to save result" };
  }

  return {
    success: true,
    message: "Result saved successfully",
    data: savedResult,
  };
}

// Get saved results
export async function getSavedResults(userId: string): Promise<SavedResultsListResponse> {
  const results = await getSavedResultsByUserId(userId);

  return {
    success: true,
    message: "Saved results retrieved",
    data: results,
  };
}

// Update saved result
export async function updateSavedResultService(
  resultId: string,
  userId: string,
  updates: Partial<Pick<SavedResult, "title" | "description" | "tags">>
): Promise<SavedResultResponse> {
  const result = await updateSavedResult(resultId, userId, updates);

  if (!result) {
    return { success: false, message: "Failed to update saved result" };
  }

  return {
    success: true,
    message: "Saved result updated",
    data: result,
  };
}

// Delete saved result
export async function deleteSavedResultService(
  resultId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const success = await deleteSavedResult(resultId, userId);

  return {
    success,
    message: success ? "Saved result deleted" : "Failed to delete saved result",
  };
}
