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
- **User accounts** — email/password auth with bcrypt hashing, profile management
- **One card per row** — same character with different meanings gets separate cards

## Getting started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local and set a real SESSION_SECRET (32+ chars)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be prompted to register an account.

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 3**
- **iron-session** — encrypted cookie sessions
- **bcryptjs** — password hashing with salt
- **File-based storage** — users in `data/users.json`, progress in `data/progress/`

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
    GroupSidebar.tsx  # Left sidebar with group list + progress bars
    Header.tsx       # Top bar with search, nav, user menu
    LauText.tsx      # Renders Lau with superscript tone numbers
    SearchResults.tsx # Search results list
  lib/
    constants.ts     # Card modes, group definitions
    progress.ts      # File-based progress storage
    session.ts       # iron-session config
    types.ts         # TypeScript types
    users.ts         # File-based user CRUD with bcrypt
data/                # Auto-created at runtime
  users.json         # User accounts (gitignored)
  progress/          # Per-user progress JSON files (gitignored)
public/
  cantonese-words.json  # Word data (2,099 entries)
```

## Notes

- The `data/` directory and its contents are gitignored — user accounts and progress are local
- The forgot-password page is a stub that simulates sending a reset email
- For production use, replace file-based storage with a proper database and add real email sending
