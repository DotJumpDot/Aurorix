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
├── LICENSE             # MIT License
└── .env.example        # Environment variables template
```

## Development Guidelines

### Backend (ElysiaJS)

- Written in TypeScript
- Uses Bun runtime
- Database: Supabase (PostgreSQL)
- API endpoints for text analysis
- Handles character counting, word density calculation, and reading level assessment
- Authentication: JWT tokens, API keys, bcrypt password hashing

### Backend Structure

```
Aurorix_Backend/src/
├── api/                # API route handlers
│   ├── auth_api.ts     # Authentication endpoints
│   ├── user_api.ts     # User management endpoints
│   └── analysis_api.ts # Text analysis endpoints
├── service/            # Business logic
│   ├── auth_service.ts    # Auth logic with JWT, bcrypt
│   ├── user_service.ts    # User management
│   └── analysis_service.ts # Text analysis algorithms
├── sql/                # Database queries
│   ├── auth_sql.ts     # User queries
│   ├── user_sql.ts     # User CRUD
│   └── analysis_sql.ts # Analysis CRUD
├── type/               # TypeScript types
│   ├── auth_type.ts    # Auth types
│   ├── user_type.ts    # User types
│   ├── analysis_type.ts # Analysis types
│   └── index.ts        # Exports
├── db.ts               # Supabase client
└── index.ts            # Main entry point
```

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
5. **No Autonomous Commands**: Do not run development commands (e.g., `bun run dev`, `bun run build`, `npm run dev`, `npm run build`, etc.) on your own. Only execute such commands when explicitly requested by the user.

## Key Features

- Character frequency analysis
- Word density calculation
- Reading level assessment (Flesch-Kincaid, SMOG, Coleman-Liau, ARI)
- Real-time text analysis
- Export capabilities (JSON, CSV)
- User authentication (JWT, OAuth)
- API key access

## Authentication

- **JWT Token**: Bearer token for session authentication
- **API Key**: For programmatic access
- **Password**: Hashed with bcrypt + PASSWORD_SALT from environment

## Technology Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Backend  | ElysiaJS, TypeScript, Bun                      |
| Database | Supabase (PostgreSQL)                          |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Runtime  | Bun                                            |

---

_This file provides context for AI agents working on the Aurorix project._
