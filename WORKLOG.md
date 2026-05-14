# Player Build Progress

## Goal
Build Svelte SPA audio player with 5 screens, global mini-player/store, S4 UI, manifest-driven library.

## Confirmed decisions
- Framework: Svelte (JS only), S4 styles.
- Data source: `public/library/index.json`.
- Search: screens 1-4, across tracks/authors/albums.
- Screen 5: no header/miniplayer/toolbar.
- Back from screen 5: previous screen.
- Rewind/FastForward: 10s.
- Queue scope for shuffle/next: current screen list.
- Persist to localStorage: track, progress, volume, mute, shuffle, repeat, queue context, screen, selected artist/album.

## Checklist
- [x] Add `artist.photo` to manifest generator.
- [x] Regenerate manifest with `artist.photo`.
- [x] Build library normalization module for quick lookups.
- [x] Build global player store + audio engine + persistence.
- [x] Build shared UI components (header, mini-player, toolbar, track row).
- [x] Build screens 1-5.
- [x] Build Web Audio visualizer (spectrum/oscilloscope).
- [x] Wire app navigation and queue context behavior.
- [x] Verify `pnpm run manifest` and `pnpm run build`.

## Resume notes
- Main entry: `src/App.svelte`.
- Manifest generator: `scripts/generate-library-manifest.mjs`.
- Build status: `pnpm run manifest` and `pnpm run build` pass.
- Main modules:
  - `src/lib/library.js` (manifest load + normalization)
  - `src/lib/player-store.js` (global playback state + persistence + audio engine)
  - `src/components/screens/*` (all 5 screens)
