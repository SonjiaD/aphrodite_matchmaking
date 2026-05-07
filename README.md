# 💘 Aphrodite

A dating app where your community makes the introductions.

---

## 🫶 The Problem

40% of couples meet through mutual connections — yet every dating app is built for solo searching. There's no way to facilitate an intro at scale, no incentive to do it well, and no feedback loop when it works.

## ⚡ The Solution

**Cupid Mode** — a matchmaking layer built on top of the dating experience. Users can play Cupid for people they know, send a spark with a personal note, and earn points when the match leads to a real connection.

- 💰 Rewards only pay out when the match actually works
  - great connection → big reward, okay → small, no match → nothing
- 👤 3 roles: **Match**, **Cupid**, **Both**
  - tab bar and features adapt based on what you pick

---

## 🎨 Design

Dark mode, purple + pink pops, glowing glass animations. Built for a college-age, AI-native user who expects polish.

---

## 🛠 Stack

| Tool | Why |
|------|-----|
| **Expo + React Native** | One codebase — runs iOS, Android, and web |
| **Expo Router** | Folder structure is the app structure; role-based tab visibility automatic |
| **TypeScript** | Entire schema readable in `types/index.ts`, zero type errors |
| **React Native Animated API** | Swipe physics, score count-up, burst particles all 60fps |
| **Claude Code** | AI pair programmer — same way I'd use it on a real team |

---

## 🚀 How to Run

```bash
npm install
npm run web
# opens at localhost:8081
```

---

## 🧠 Code Notes

**`context/overlay.tsx`** — custom `overlay.present()` that keeps modals inside the phone shell. React Native's built-in `Modal` renders at the OS level and breaks out of the web container on web.

**`data/`** — profiles, sparks, leaderboard. Treated as the production schema — hand this to a backend engineer and they know exactly what Supabase tables to build.

**`app/_layout.tsx`** — CSS injected at runtime for web-only properties (`backdrop-filter`, gradient shell background). React Native doesn't support these natively so platform is detected and styles are injected into the DOM directly.

---

## 🔄 Iteration

- 🪟 Modals were see-through — glass surface token was 10% opacity, fixed with a solid dark background
- 📐 Tab spacing — `display:none` vs `width:0` on hidden tabs; the latter still reserves flex space, the former collapses it completely
- 🎯 Points economy — spark-only rewards incentivize spam, added +1 for Pass and Skip to reward curation over volume
