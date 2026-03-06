/**
 * Text Analysis Types for Aurorix
 */

export interface CharacterAnalysis {
  total_characters: number;
  unique_characters: number;
  character_frequency: Record<string, number>;
  uppercase_count: number;
  lowercase_count: number;
  digit_count: number;
  special_char_count: number;
}

export interface WordAnalysis {
  total_words: number;
  unique_words: number;
  word_frequency: Record<string, number>;
  average_word_length: number;
}

export interface ReadingLevel {
  flesch_reading_ease: number | null;
  flesch_kincaid_grade: number | null;
  smog_index: number | null;
  coleman_liau_index: number | null;
  automated_readability_index: number | null;
}

export interface TextAnalysis {
  id: string;
  user_id: string;
  text_content: string;
  text_hash: string;
  character_analysis: CharacterAnalysis;
  word_analysis: WordAnalysis;
  reading_level: ReadingLevel;
  language_detected: string;
  reading_time_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeTextRequest {
  text: string;
  save?: boolean;
}

export interface AnalyzeTextResponse {
  success: boolean;
  message: string;
  data?: TextAnalysis;
}

export interface SavedResult {
  id: string;
  user_id: string;
  analysis_id: string | null;
  title: string | null;
  description: string | null;
  tags: string[];
  export_data: TextAnalysis;
  created_at: string;
  updated_at: string;
}

export interface SaveResultRequest {
  analysis_id: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface SavedResultResponse {
  success: boolean;
  message: string;
  data?: SavedResult;
}

export interface SavedResultsListResponse {
  success: boolean;
  message: string;
  data?: SavedResult[];
}

export interface AnalysisHistoryResponse {
  success: boolean;
  message: string;
  data?: TextAnalysis[];
}
