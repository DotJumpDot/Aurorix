# Aurorix Setup Guide

Character Frequency Analyzer - Setup Instructions

## Prerequisites

- Bun runtime installed
- Supabase account (free tier works)
- Git

## Step 1: Clone and Setup

```bash
git clone <repository-url>
cd Aurorix
```

## Step 2: Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Run the schema from `Docs/database-schema.sql`
4. Go to Authentication > Providers and enable:
   - Google OAuth
   - GitHub OAuth
   - Email/Password
5. Copy your Project URL and Anon Key from Settings > API

## Step 3: Environment Configuration

Create `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your values:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Backend Configuration
PORT=4200
NODE_ENV=development
API_KEY=your_secure_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_min_32_chars

# Password Security
PASSWORD_SALT=your_password_salt_here

# Frontend Configuration
FRONTEND_BASE_URL=http://localhost:4100
```

## Step 4: Backend Setup

```bash
cd Aurorix_Backend

# Install dependencies
bun install

# Start development server
bun run dev
```

Backend will run on http://localhost:4200

## Step 5: Frontend Setup

```bash
cd Aurorix_Frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:4200
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF

# Install dependencies
bun install

# Start development server
bun run dev
```

Frontend will run on http://localhost:4100

## Step 6: Configure OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:4100/auth/callback`
4. Copy Client ID and Secret to Supabase Auth settings

### GitHub OAuth

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:4100/auth/callback`
4. Copy Client ID and Secret to Supabase Auth settings

## Step 7: Test the Application

1. Open http://localhost:4100
2. Click "Get Started" or "Login"
3. Sign in with your preferred method
4. Try the text analyzer:
   - Paste or type text into the input area
   - View character frequency analysis
   - Check word density statistics
   - Review reading level metrics
   - Save results for later

## Features

- ✅ Character frequency analysis
- ✅ Word density calculation
- ✅ Reading level assessment (Flesch-Kincaid, SMOG, Coleman-Liau, ARI)
- ✅ Real-time analysis
- ✅ Export results as JSON/CSV
- ✅ Save and organize analysis history
- ✅ OAuth authentication (Google, GitHub)
- ✅ API key access for programmatic use
- ✅ Responsive dashboard

## Production Deployment

### Backend (e.g., Railway, Render, Fly.io)

1. Set environment variables in hosting platform
2. Deploy from `Aurorix_Backend` directory
3. Ensure all environment variables are set

### Frontend (e.g., Vercel, Netlify)

1. Connect your Git repository
2. Set root directory to `Aurorix_Frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## API Documentation

Once backend is running, visit:

- Swagger UI: http://localhost:4200/w
- Health Check: http://localhost:4200/health

## Troubleshooting

### CORS Issues

Make sure `FRONTEND_BASE_URL` in backend `.env` matches your frontend URL.

### Database Connection

Verify Supabase credentials and that the schema was applied correctly in the SQL Editor.

### OAuth Not Working

Check that redirect URLs match exactly in both OAuth provider and Supabase settings.

### JWT Errors

Ensure `JWT_SECRET` is at least 32 characters long.
