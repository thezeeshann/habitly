# Habitly

A clean, free, no-account habit tracker for macOS — plus the marketing
landing page that ships with it.

![Habitly landing page hero](./web/assets/hero.png)

## What's in here

This repo holds two separate things:

- **`src/`** — the Electron desktop app (Today / Weekly / Progress views, a
  habit modal, local persistence).
- **`web/`** — a zero-build static landing page (`web/index.html`) used to
  market and distribute the app.

## Features

- Add, edit, and delete habits with an icon and a custom repeat schedule.
- **Today** — check off habits, see today's streaks and completion ring.
- **Weekly** — a 7-day grid of done/missed/pending per habit.
- **Progress** — best streak, this week's completion rate, and a **Month**
  tab that graphs your real day-by-day completion history.
- Data persists locally (`electron-store`) — nothing leaves your machine,
  no account, no network calls. See [`SECURITY.md`](./SECURITY.md).

## Tech stack

- Electron Forge + Vite + TypeScript
- React 19 (renderer UI)
- `electron-store` for local persistence
- Plain HTML/CSS for the landing page (no build step)

## Project structure

```
src/
  lib/
    store/        # electron-store setup (main) + contextBridge API (preload)
    data/seed.ts   # demo habit data
    types.ts       # shared types (Habit, HistoryEntry, PersistedState)
  components/      # title-bar, sidebar, habit-modal, circular-progress
  views/           # today-view, weekly-view, progress-view
  App.tsx, main.ts, preload.ts, renderer.tsx, global.d.ts, index.css
web/
  index.html, styles.css, assets/   # landing page + favicon/OG images
build/
  icon.icns, icon.iconset/          # macOS app icon
design/                             # original design mockups (reference only)
```

## Getting started

```bash
yarn install
yarn start      # launch the desktop app in dev mode
```

### Building the macOS app

```bash
yarn make       # produces a .dmg and .zip in out/make
```

### Running the landing page

`web/` has no build step — just open it directly:

```bash
open web/index.html
# or, to serve it over http://localhost instead of file://
npx serve web
```

## Other scripts

```bash
yarn lint              # eslint
npx tsc --noEmit       # type-check
```

## Deploying the landing page

`web/` deploys to Vercel as-is: import the repo, set **Root Directory** to
`web`, no build command needed. Update the `og:image`/`twitter:image` tags
in `web/index.html` with the deployed absolute URL once it's live, and swap
the "Download for macOS" links from `#` to the real `.dmg` (e.g. a GitHub
Release asset).

## License

MIT
