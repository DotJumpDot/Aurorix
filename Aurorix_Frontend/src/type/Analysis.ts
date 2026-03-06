export interface AnalysisResult {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  character_count: number;
  word_count: number;
  sentence_count: number;
  paragraph_count: number;
  character_frequency: Record<string, number>;
  word_density: Record<string, number>;
  reading_level: {
    flesch_kincaid: number;
    smog: number;
    coleman_liau: number;
    ari: number;
    average: number;
  };
}

export interface AnalysisRequest {
  text: string;
  options?: {
    includeCharacterFrequency?: boolean;
    includeWordDensity?: boolean;
    includeReadingLevel?: boolean;
  };
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data?: AnalysisResult;
}
