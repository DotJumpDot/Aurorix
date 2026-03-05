# Aurorix

> A powerful Character Frequency Analyzer with word density and reading level assessment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-black.svg)](https://bun.sh/)

## Features

- **Character Frequency Analysis**: Count and analyze character usage in text
- **Word Density Calculator**: Identify most frequently used words
- **Reading Level Assessment**: Calculate Flesch-Kincaid and other readability scores
- **Real-time Analysis**: Instant feedback as you type
- **Export Options**: Save results as JSON or CSV
- **Modern UI**: Clean, responsive interface built with Next.js

## Project Structure

This is a monorepo containing both backend and frontend applications:

```
Aurorix/
├── Aurorix_Backend/     # ElysiaJS API server
├── Aurorix_Frontend/    # Next.js web application
├── Docs/                # Documentation
└── [Config Files]       # Root-level configuration
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Backend Setup

```bash
cd Aurorix_Backend
bun install
bun run dev
```

The backend will start on `http://localhost:3001`

### Frontend Setup

```bash
cd Aurorix_Frontend
bun install
bun run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

| Endpoint       | Method | Description                                                           |
| -------------- | ------ | --------------------------------------------------------------------- |
| `/api/analyze` | POST   | Analyze text for character frequency, word density, and reading level |
| `/api/health`  | GET    | Health check endpoint                                                 |

## Analysis Features

### Character Analysis

- Total character count
- Unique character count
- Character frequency distribution
- Uppercase/lowercase breakdown
- Special character detection

### Word Analysis

- Total word count
- Word frequency ranking
- Average word length
- Unique word count
- Vocabulary richness

### Reading Level

- Flesch Reading Ease score
- Flesch-Kincaid Grade Level
- SMOG Index
- Coleman-Liau Index
- Automated Readability Index

## Tech Stack

### Backend

- **ElysiaJS** - Fast, type-safe web framework
- **TypeScript** - Type-safe development
- **Bun** - Fast JavaScript runtime

### Frontend

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS

## Scripts

### Backend

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
```

### Frontend

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 DotJumpDot

---

Built with ❤️ by DotJumpDot
