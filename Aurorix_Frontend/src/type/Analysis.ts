export interface AnalysisResult {
  id: string;
  user_id: string;
  text_content: string;
  text_hash: string;
  created_at: string;
  updated_at: string;
  character_analysis: {
    total_characters: number;
    unique_characters: number;
    character_frequency: Record<string, number>;
    uppercase_count: number;
    lowercase_count: number;
    digit_count: number;
    special_char_count: number;
  };
  word_analysis: {
    total_words: number;
    unique_words: number;
    word_frequency: Record<string, number>;
    average_word_length: number;
  };
  reading_level: {
    flesch_reading_ease: number;
    flesch_kincaid_grade: number;
    smog_index: number;
    coleman_liau_index: number;
    automated_readability_index: number;
  };
  language_detected: string;
  reading_time_seconds: number;
}

export interface AnalysisRequest {
  text: string;
  save?: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data?: AnalysisResult;
}
