# Changelog

All notable changes to Aurorix will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-03-05 15:51

### Added

- **Initial Release**: Complete character frequency analyzer
  - **Character Analysis**: Count total characters, unique characters, and frequency distribution
  - **Word Density**: Calculate word frequency and identify most common words
  - **Reading Level**: Assess text readability using Flesch-Kincaid and other metrics
  - **Real-time Processing**: Instant analysis as user types
  - **Export Functionality**: Download results as JSON or CSV
  - **Monorepo Structure**: Organized backend (ElysiaJS) and frontend (Next.js) architecture
  - **TypeScript Support**: Full type safety across the entire stack
  - **Modern UI**: Clean, responsive interface with Tailwind CSS

### Features

- **Backend API**:
  - `/api/analyze` - POST endpoint for text analysis
  - `/api/health` - Health check endpoint
  - Character frequency calculation
  - Word density analysis
  - Multiple reading level algorithms (Flesch, SMOG, Coleman-Liau, ARI)

- **Frontend Application**:
  - Text input area with character count
  - Results dashboard with visualizations
  - Export buttons for JSON/CSV download
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

### Documentation

- Comprehensive README with setup instructions
- API documentation with endpoint details
- Changelog following Keep a Changelog format
- MIT License file

### Tech Stack

- **Backend**: ElysiaJS, TypeScript, Bun
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
