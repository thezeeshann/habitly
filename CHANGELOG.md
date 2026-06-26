# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2026-06-26

### Fixed

- Removed ad-hoc `osxSign` that was added in v1.1.1 — it conflicted with the
  embedded ASAR integrity fuse and made Gatekeeper's "damaged" error worse.
- Landing page: replaced the near-invisible Gatekeeper footnote with a
  prominent, styled "First-time macOS setup" box showing the exact
  `xattr -cr` steps users need to open the app.

## [1.1.1] - 2026-06-26

### Fixed

- macOS Gatekeeper: added ad-hoc code signing (`osxSign`) to the build so
  the app no longer shows "damaged and can't be opened" on first launch.
- Landing page and README now include the `xattr -cr` workaround instruction
  for users who still see a Gatekeeper warning after downloading.

## [1.1.0] - 2026-06-24

### Added

- Settings view: light/dark/system theme, 5 accent colors, week-start day,
  show/hide streaks & completion %, a daily reminder, and a full data reset.
- Dark mode across every view, driven by CSS variables.
- Accent color presets (`src/lib/constants/accent-colors.ts`) applied via
  CSS custom properties, so the whole UI re-themes from one selection.
- The app's real version (from `package.json`) now shows in
  Settings → About, via a new `habitly:version` IPC channel.

### Changed

- Today tab: the done-state checkmark circle now has visible padding
  around the check icon instead of nearly filling the circle.
- Today tab: the edit/delete icons on each habit row are less faint
  (opacity 0.25 → 0.55) for better visibility.
- Landing page: the nav bar wordmark shifted ~18px left.

## [1.0.0] - 2026-06-21

### Added

- Initial release: Today, Weekly, and Progress views with habit add/edit/
  delete, streaks, and a real day-by-day Month chart.
- Local-only persistence via `electron-store` — no account, no network
  calls.
- Marketing landing page (`web/`) with a macOS download link.
- macOS arm64 `.dmg`/`.zip` builds via Electron Forge.
