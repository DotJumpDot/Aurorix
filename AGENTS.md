# Aurorix - AI Agent Instructions

## Project Overview

**Aurorix** is a Character Frequency Analyzer that analyzes text for character count, word density, and reading level. This is a monorepo containing:

- **Backend**: ElysiaJS API for text analysis processing
- **Frontend**: Next.js web application for user interface

## Architecture

```
Aurorix/
├── Aurorix_Backend/     # ElysiaJS backend API
├── Aurorix_Frontend/    # Next.js frontend
├── Docs/                # Additional documentation
├── AGENTS.md           # This file
├── README.md           # Project documentation
├── CHANGELOG.md        # Version history
└── LICENSE             # MIT License
```

## Development Guidelines

### Backend (ElysiaJS)

- Written in TypeScript
- Uses Bun runtime
- API endpoints for text analysis
- Handles character counting, word density calculation, and reading level assessment

### Frontend (Next.js)

- React with TypeScript
- Tailwind CSS for styling
- API integration with backend
- Responsive design for text input and results display

## AI Agent Context

When working on this project:

1. **Backend Changes**: Modify files in `Aurorix_Backend/`
2. **Frontend Changes**: Modify files in `Aurorix_Frontend/`
3. **Documentation**: Update root-level markdown files as needed
4. **API Contracts**: Ensure frontend and backend API contracts remain in sync

## Key Features to Implement

- Character frequency analysis
- Word density calculation
- Reading level assessment (Flesch-Kincaid, etc.)
- Real-time text analysis
- Export capabilities (JSON, CSV)

## Technology Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Backend  | ElysiaJS, TypeScript, Bun                      |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Runtime  | Bun                                            |

---

_This file provides context for AI agents working on the Aurorix project._
