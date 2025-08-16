# Typing Game (Next.js + Supabase + MUI)

A real-time multiplayer typing game where users compete live by typing the same sentence. The game tracks each player's WPM (Words Per Minute) and accuracy. Built using:

- **Next.js (App Router)**
- **Supabase (Database + Realtime)**
- **Material UI (MUI)**

---

🌐 Live Demo

🔗 https://tonik-app-mu.vercel.app/

## 🚀 Features

- 🔤 Type a randomly fetched sentence as fast and accurately as possible
- ⏱ 60-second game timer with live countdown
- 👥 Real-time table showing other players' progress (WPM + accuracy)
- 🧠 Local `player_id` stored via `localStorage` to identify users without login
- 📊 Results are stored in Supabase `results` table after game ends
- ♻️ Player progress is removed from Supabase after game ends

---

### 1. Install dependencies

```bash
npm install

## 📁 Project Structure
/components
├── TypingArea.tsx         // The input + timer area
├── GameResult.tsx         // Shows final WPM and accuracy
└── LivePlayersTable.tsx   // Displays other players’ live progress

/lib
├── supabaseClient.ts      // Supabase client instance
├── getQuote.ts            // Fetches random quote
└── savePlayerProgress.ts  // Upserts current player progress to Supabase

/app
├── page.tsx               // Home page
└── game/page.tsx          // Main game logic
```

## ⚙️ Game Logic Overview

### 1. **Start Game**

- User enters a nickname on the home page.
- A countdown from 3 starts.
- A random quote is fetched from [api.quotable.io](https://api.quotable.io/random).

### 2. **During Game**

- Timer starts (max 60 seconds).
- Input is tracked.
- Every **300ms**, the user's current input, WPM, and accuracy are **upserted** into the `player_progress` table.

### 3. **Live Players Table**

- Subscribed to Supabase `player_progress` table via `realtime`.
- Shows other players typing in the same `round_id` (based on current timestamp).
- Automatically updates as players type.

### 4. **Game End**

- Game ends when the sentence is completed or 60 seconds pass.
- Final WPM and accuracy are saved to `results` table.
- Player's row is **removed** from `player_progress` table to clear the live table.

---
