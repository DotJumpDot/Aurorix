-- Aurorix Database Schema
-- Character Frequency Analyzer Database
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLEAN SETUP: Drop existing tables and recreate
-- WARNING: This will delete all existing data!
-- ============================================

-- Drop dependent tables first
DROP TABLE IF EXISTS text_analyses CASCADE;
DROP TABLE IF EXISTS saved_results CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  provider VARCHAR(50) CHECK (provider IS NULL OR provider IN ('google', 'github', 'email')),
  provider_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

-- ============================================
-- TEXT ANALYSES TABLE
-- Stores analysis history for authenticated users
-- ============================================
CREATE TABLE text_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Input text (truncated for storage, store hash of full text)
  text_content TEXT NOT NULL,
  text_hash VARCHAR(64) NOT NULL,
  
  -- Character Analysis
  total_characters INTEGER NOT NULL DEFAULT 0,
  unique_characters INTEGER NOT NULL DEFAULT 0,
  character_frequency JSONB DEFAULT '{}',
  uppercase_count INTEGER NOT NULL DEFAULT 0,
  lowercase_count INTEGER NOT NULL DEFAULT 0,
  digit_count INTEGER NOT NULL DEFAULT 0,
  special_char_count INTEGER NOT NULL DEFAULT 0,
  
  -- Word Analysis
  total_words INTEGER NOT NULL DEFAULT 0,
  unique_words INTEGER NOT NULL DEFAULT 0,
  word_frequency JSONB DEFAULT '{}',
  average_word_length DECIMAL(5,2) DEFAULT 0,
  
  -- Reading Level Metrics
  flesch_reading_ease DECIMAL(5,2),
  flesch_kincaid_grade DECIMAL(5,2),
  smog_index DECIMAL(5,2),
  coleman_liau_index DECIMAL(5,2),
  automated_readability_index DECIMAL(5,2),
  
  -- Metadata
  language_detected VARCHAR(10) DEFAULT 'en',
  reading_time_seconds INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SAVED RESULTS TABLE
-- Stores user-saved analysis results
-- ============================================
CREATE TABLE saved_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES text_analyses(id) ON DELETE SET NULL,
  
  -- User-defined metadata
  title VARCHAR(255),
  description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Export data (full analysis snapshot)
  export_data JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_text_analyses_user_id ON text_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_text_analyses_created_at ON text_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_text_analyses_text_hash ON text_analyses(text_hash);

CREATE INDEX IF NOT EXISTS idx_saved_results_user_id ON saved_results(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_results_analysis_id ON saved_results(analysis_id);
CREATE INDEX IF NOT EXISTS idx_saved_results_tags ON saved_results USING GIN(tags);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Text analyses: users can only access their own
CREATE POLICY "Users can view own analyses" ON text_analyses
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analyses" ON text_analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own analyses" ON text_analyses
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own analyses" ON text_analyses
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Saved results: users can only access their own
CREATE POLICY "Users can view own saved results" ON saved_results
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own saved results" ON saved_results
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own saved results" ON saved_results
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own saved results" ON saved_results
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_analyses_updated_at BEFORE UPDATE ON text_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_results_updated_at BEFORE UPDATE ON saved_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
