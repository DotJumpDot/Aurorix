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
- **User Authentication**: JWT tokens, API keys, OAuth support
- **Supabase Database**: Persistent storage for analysis history

## Project Structure

This is a monorepo containing both backend and frontend applications:

```
Aurorix/
├── Aurorix_Backend/     # ElysiaJS API server
├── Aurorix_Frontend/    # Next.js web application
├── Docs/                # Documentation
├── AGENTS.md           # AI agent instructions
├── README.md           # This file
├── CHANGELOG.md        # Version history
├── LICENSE             # MIT License
└── .env.example        # Environment template
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- [Supabase](https://supabase.com/) account

### Backend Setup

```bash
cd Aurorix_Backend

# Install dependencies
bun install

# Copy environment template
cp ../.env.example .env

# Edit .env with your Supabase credentials
# Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# Required: JWT_SECRET, PASSWORD_SALT, API_KEY

# Start development server
bun run dev
```

The backend will start on `http://localhost:4200`

### Frontend Setup

```bash
cd Aurorix_Frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:4200
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EOF

# Install dependencies
bun install

# Start development server
bun run dev
```

The frontend will start on `http://localhost:4100`

## Database Setup

1. Create a Supabase project
2. Run the SQL schema in `Docs/database-schema.sql` via the Supabase SQL Editor
3. Configure your `.env` with Supabase credentials

## API Endpoints

### Authentication

| Endpoint                   | Method | Description                  |
| -------------------------- | ------ | ---------------------------- |
| `/auth/login`              | POST   | Login with username/password |
| `/auth/register`           | POST   | Register new user            |
| `/auth/me`                 | GET    | Get current user             |
| `/auth/regenerate-api-key` | POST   | Regenerate API key           |

### Users

| Endpoint     | Method | Description    |
| ------------ | ------ | -------------- |
| `/users`     | GET    | List all users |
| `/users/:id` | GET    | Get user by ID |
| `/users/:id` | PUT    | Update user    |
| `/users/:id` | DELETE | Delete user    |

### Analysis

| Endpoint              | Method | Description          |
| --------------------- | ------ | -------------------- |
| `/analysis/analyze`   | POST   | Analyze text         |
| `/analysis/history`   | GET    | Get analysis history |
| `/analysis/:id`       | GET    | Get single analysis  |
| `/analysis/:id`       | DELETE | Delete analysis      |
| `/analysis/save`      | POST   | Save analysis result |
| `/analysis/saved`     | GET    | Get saved results    |
| `/analysis/saved/:id` | PUT    | Update saved result  |
| `/analysis/saved/:id` | DELETE | Delete saved result  |

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
- **Supabase** - Database and authentication

### Frontend

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS

## Environment Variables

### Backend (.env)

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=4200
NODE_ENV=development
API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
PASSWORD_SALT=your_password_salt
FRONTEND_BASE_URL=http://localhost:4100
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
