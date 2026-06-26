# 粵語 Cantonese Flashcards

Study the 2,100 most common Cantonese words with Sidney Lau romanisation.

## Features

- **Flashcard study** — 42 groups of 50 words, with 3D CSS flip cards
- **5 card modes** — configure what shows on front vs back:
  1. Chinese → Meaning + Lau + sentences
  2. Chinese + Lau → Meaning + sentences
  3. English → Chinese + Lau + sentences
  4. Chinese + Meaning → Lau + sentences
  5. Chinese + Lau → English + sentences
- **Progress tracking** — tick (✓) to mark known, cross (✕) to review again. Progress bars per group. Reset per group.
- **Search** — by Chinese character, English meaning, or Lau romanisation
- **Lau superscript** — tone numbers render as superscript throughout
- **Keyboard shortcuts** — space to flip, ←→ to navigate, k/j for know/skip
- **Responsive** — mobile drawer sidebar, touch-friendly controls, tablet and desktop layouts
- **User accounts** — email/password auth with bcrypt hashing, profile management
- **One card per row** — same character with different meanings gets separate cards

## Getting started (local dev)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — register a new account to begin.

In local dev, users and progress are stored as JSON files under `data/`.

## Deploy to Netlify

1. Push to a Git repo (GitHub, GitLab, Bitbucket)
2. Connect the repo in [Netlify](https://app.netlify.com/)
3. Netlify auto-detects Next.js and applies `@netlify/plugin-nextjs`
4. Set the following **environment variable** in Netlify UI → Site settings → Environment variables:
   - `SESSION_SECRET` — a random string of at least 32 characters (e.g. `openssl rand -base64 32`)
5. Deploy — that's it

In production on Netlify, all data (users, progress) is stored in **Netlify Blobs** automatically. No database setup needed.

## Storage architecture

The app uses a `KVStore` abstraction (`src/lib/storage.ts`) that switches backend based on environment:

| Environment | Backend | Location |
|---|---|---|
| `npm run dev` | Local filesystem | `data/users/`, `data/progress/` |
| `netlify dev` | Netlify Blobs (local emulator) | Managed by Netlify CLI |
| Netlify production | Netlify Blobs | Netlify's edge KV store |

Detection is automatic via `NETLIFY` and `NETLIFY_BLOBS_CONTEXT` environment variables that Netlify sets at build/runtime.

### Stores

- **`users`** — all user accounts stored under a single `"all"` key as a JSON array (passwords are bcrypt-hashed with 12 salt rounds)
- **`progress`** — one key per user ID, storing their per-group remember/don't-remember lists

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 3**
- **iron-session** — encrypted cookie sessions
- **bcryptjs** — password hashing with salt
- **@netlify/blobs** — production key-value storage
- **File-based fallback** — local dev storage under `data/`

## Data

The word data lives at `public/cantonese-words.json` (2,099 entries). Each entry:

```json
{
  "id": 1,
  "group": 1,
  "groupLabel": "1-50",
  "word": "我",
  "frequency": 22935,
  "meaning": "I; me; my",
  "lau": "ngoh5",
  "sentences": [
    { "chinese": "我知。", "english": "I know.", "lau": "ngoh5 ji1" }
  ]
}
```

## Project structure

```
src/
  app/
    api/auth/        # login, register, logout, me (profile update)
    api/progress/    # GET/POST progress
    login/           # Login page
    register/        # Registration page
    forgot-password/ # Forgot password (simulated)
    study/           # Main flashcard app (study, search, settings, profile views)
  components/
    FlipCard.tsx     # 3D CSS flip card with tick/cross
    CardFace.tsx     # Renders front/back content based on mode fields
    GroupSidebar.tsx  # Left sidebar / mobile drawer with group list + progress bars
    Header.tsx       # Top bar with search, nav, user menu, mobile hamburger
    LauText.tsx      # Renders Lau with superscript tone numbers
    SearchResults.tsx # Search results list
  lib/
    constants.ts     # Card modes, group definitions
    progress.ts      # Progress read/write via storage abstraction
    session.ts       # iron-session config
    storage.ts       # KVStore abstraction (file / Netlify Blobs)
    types.ts         # TypeScript types
    users.ts         # User CRUD via storage abstraction with bcrypt
data/                # Auto-created at runtime (local dev only)
  users/             # User accounts (gitignored)
  progress/          # Per-user progress files (gitignored)
public/
  cantonese-words.json  # Word data (2,099 entries)
netlify.toml         # Netlify build config
```
