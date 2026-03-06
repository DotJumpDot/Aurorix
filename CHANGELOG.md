# Changelog

All notable changes to Aurorix will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-03-05 15:51

### Added

- **Initial Release**: Complete character frequency analyzer
  - **Character Analysis**: Count total characters, unique characters, and frequency distribution
  - **Word Density**: Calculate word frequency and identify most common words
  - **Reading Level**: Assess text readability using Flesch-Kincaid, SMOG, Coleman-Liau, and ARI
  - **Real-time Processing**: Instant analysis as user types
  - **Export Functionality**: Download results as JSON
  - **Monorepo Structure**: Organized backend (ElysiaJS) and frontend (Next.js) architecture
  - **TypeScript Support**: Full type safety across the entire stack
  - **Modern UI**: Clean, responsive interface with Tailwind CSS

### Features

- **Backend API**:
  - `/auth/login` - POST endpoint for login
  - `/auth/register` - POST endpoint for registration
  - `/auth/me` - GET current user info
  - `/auth/regenerate-api-key` - POST to regenerate API key
  - `/users/:id` - CRUD for user profiles
  - `/analysis/analyze` - POST endpoint for text analysis
  - `/analysis/history` - GET analysis history
  - `/analysis/saved` - GET saved results
  - Character frequency calculation
  - Word density analysis
  - Multiple reading level algorithms (Flesch, SMOG, Coleman-Liau, ARI)

- **Frontend Application**:
  - Text input area with character count
  - Results dashboard with visualizations
  - Save and export buttons
  - Responsive design for mobile and desktop
  - Real-time analysis toggle

- **Analysis Metrics**:
  - Total and unique character counts
  - Character case breakdown (uppercase/lowercase)
  - Special character detection
  - Word count and unique word count
  - Average word length
  - Vocabulary richness score
  - Flesch Reading Ease
  - Flesch-Kincaid Grade Level
  - SMOG Index
  - Coleman-Liau Index
  - Automated Readability Index
  - Estimated reading time

### Database

- **Supabase Integration**:
  - Users table with authentication
  - Text analyses table for history
  - Saved results table for favorites
  - Row Level Security (RLS) policies
  - Performance indexes

### Authentication

- **JWT Tokens**: Bearer token authentication
- **API Keys**: Programmatic access support
- **Password Hashing**: bcrypt with PASSWORD_SALT
- **OAuth Ready**: Google and GitHub support structure

### Documentation

- Comprehensive README with setup instructions
- API documentation with endpoint details
- Database schema documentation
- Setup guide
- Changelog following Keep a Changelog format
- MIT License file
- AI Agent instructions (AGENTS.md)

### Tech Stack

- **Backend**: ElysiaJS, TypeScript, Bun
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Runtime**: Bun
- **Build Tools**: Next.js built-in, Bun bundler

---

## Version Format

Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR**: Incompatible API changes
- **MINOR**: Added functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Date Format

Dates use format: `YYYY-MM-DD HH:MM` (UTC+7, Bangkok Time)
