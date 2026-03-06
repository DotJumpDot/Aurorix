# Aurorix Database Schema

## Table of Contents

- [Aurorix Database Schema](#aurorix-database-schema)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Core Entities](#core-entities)
    - [User](#user)
    - [Text Analysis](#text-analysis)
    - [Saved Result](#saved-result)
  - [Entity Relationships](#entity-relationships)
  - [SQL Schema](#sql-schema)
  - [Security](#security)
    - [Row Level Security (RLS)](#row-level-security-rls)
    - [Authentication](#authentication)
  - [Indexes](#indexes)

---

## Overview

This document describes the complete database schema for Aurorix - a Character Frequency Analyzer platform.

---

## Core Entities

### User

| Column        | Type         | Nullable | Description                            |
| ------------- | ------------ | -------- | -------------------------------------- |
| id            | UUID         | No       | Primary key, auto-generated            |
| username      | VARCHAR(50)  | No       | Unique username for login              |
| email         | VARCHAR(255) | Yes      | User's email address                   |
| password      | VARCHAR(255) | Yes      | Bcrypt hashed password                 |
| provider      | VARCHAR(50)  | Yes      | OAuth provider (google, github, email) |
| provider_id   | VARCHAR(255) | Yes      | Provider's unique user ID              |
| created_at    | TIMESTAMP    | No       | Record creation timestamp              |
| updated_at    | TIMESTAMP    | No       | Record last update timestamp           |

### Text Analysis

| Column                      | Type         | Nullable | Description                            |
| --------------------------- | ------------ | -------- | -------------------------------------- |
| id                          | UUID         | No       | Primary key                            |
| user_id                     | UUID         | No       | Foreign key to users.id                |
| text_content                | TEXT         | No       | The analyzed text content              |
| text_hash                   | VARCHAR(64)  | No       | SHA-256 hash of text for deduplication |
| **Character Metrics**       |              |          |                                        |
| total_characters            | INTEGER      | No       | Total character count                  |
| unique_characters           | INTEGER      | No       | Count of unique characters             |
| character_frequency         | JSONB        | No       | Frequency map of each character        |
| uppercase_count             | INTEGER      | No       | Count of uppercase letters             |
| lowercase_count             | INTEGER      | No       | Count of lowercase letters             |
| digit_count                 | INTEGER      | No       | Count of numeric digits                |
| special_char_count          | INTEGER      | No       | Count of special characters            |
| **Word Metrics**            |              |          |                                        |
| total_words                 | INTEGER      | No       | Total word count                       |
| unique_words                | INTEGER      | No       | Count of unique words                  |
| word_frequency              | JSONB        | No       | Frequency map of top words             |
| average_word_length         | DECIMAL(5,2) | No       | Average characters per word            |
| **Reading Level**           |              |          |                                        |
| flesch_reading_ease         | DECIMAL(5,2) | Yes      | Flesch Reading Ease score              |
| flesch_kincaid_grade        | DECIMAL(5,2) | Yes      | Flesch-Kincaid Grade Level             |
| smog_index                  | DECIMAL(5,2) | Yes      | SMOG Index score                       |
| coleman_liau_index          | DECIMAL(5,2) | Yes      | Coleman-Liau Index                     |
| automated_readability_index | DECIMAL(5,2) | Yes      | ARI score                              |
| **Metadata**                |              |          |                                        |
| language_detected           | VARCHAR(10)  | No       | Detected language code (default: 'en') |
| reading_time_seconds        | INTEGER      | No       | Estimated reading time                 |
| created_at                  | TIMESTAMP    | No       | Record creation timestamp              |
| updated_at                  | TIMESTAMP    | No       | Record last update timestamp           |

### Saved Result

| Column      | Type         | Nullable | Description                     |
| ----------- | ------------ | -------- | ------------------------------- |
| id          | UUID         | No       | Primary key                     |
| user_id     | UUID         | No       | Foreign key to users.id         |
| analysis_id | UUID         | Yes      | Foreign key to text_analyses.id |
| title       | VARCHAR(255) | Yes      | User-defined title              |
| description | TEXT         | Yes      | User-defined description        |
| tags        | TEXT[]       | No       | Array of tags                   |
| export_data | JSONB        | No       | Complete analysis snapshot      |
| created_at  | TIMESTAMP    | No       | Record creation timestamp       |
| updated_at  | TIMESTAMP    | No       | Record last update timestamp    |

---

## Entity Relationships

```
user (1) ──── (many) text_analyses
user (1) ──── (many) saved_results
text_analyses (1) ──── (many) saved_results
```

---

## SQL Schema

See [database-schema.sql](./database-schema.sql) for the complete SQL.

---

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Users**: Users can only view/update their own records
- **Text Analyses**: Users can only access their own analyses
- **Saved Results**: Users can only access their own saved results

### Authentication

- JWT tokens for session-based authentication
- API keys for programmatic access
- Passwords hashed with bcrypt + salt

---

## Indexes

Performance-optimized indexes:

- `idx_users_username` - Fast username lookups
- `idx_users_email` - Fast email lookups
- `idx_text_analyses_user_id` - Filter by user
- `idx_text_analyses_created_at` - Sort by date
- `idx_text_analyses_text_hash` - Deduplication checks
- `idx_saved_results_tags` - Tag-based searches (GIN index)
