# spotify-vibe-sorter

Sorts your Spotify liked songs into "vibe" playlists (e.g. "fast beats",
"melancholic", "indie pop") using Claude to classify each track from its
metadata (title/artist/album/genres) — Spotify no longer exposes audio
features (energy/valence/tempo) to new apps, so this leans on metadata +
the model's own knowledge of the artists/songs instead.

Pipeline, run in order:

1. **`fetch`** — pulls all your liked songs + resolves artist genres from
   Spotify into `data/tracks.json` / `data/artists.json`. Safe to re-run
   later to pick up newly liked songs (only fetches what's new).
2. **`classify`** — sends tracks to Claude in batches against your
   `categories.json`, writing `data/classifications.json`. Tracks already
   confidently assigned to a category that still exists are **not**
   re-classified on a later run — only new tracks and ones that came back
   `unsorted` last time get sent again. So you can add a new category later
   and re-run `classify`; it'll only re-check the leftover `unsorted` pile
   against the fuller list, not your whole library. Use `--force` to
   re-classify everything from scratch (e.g. if you significantly reworded
   existing categories).
3. **`report`** — writes `data/report.md` (human-readable, grouped by
   category) and `data/report.csv` (one row per track). **Review it now**:
   you can hand-edit the `category` column in the CSV to fix mistakes or
   pull tracks out of `unsorted` before applying anything to Spotify.
4. **`apply`** — reads `data/report.csv` and creates/updates the actual
   Spotify playlists (named `Vibe: <category>` by default), adding any
   tracks that aren't already in them. Re-running it is safe/idempotent.
   Use `--dry-run` to see what it would do without touching Spotify.

## Setup

```bash
cd spotify-vibe-sorter
pnpm install --ignore-workspace   # this folder isn't part of the site's pnpm workspace
cp env.example .env
```

Fill in `.env`:

- `SPOTIFY_CLIENT_ID` — create an app at the
  [Spotify Developer Dashboard](https://developer.spotify.com/dashboard),
  add `http://127.0.0.1:8888/callback` as a Redirect URI (Settings → Redirect
  URIs). No client secret needed (this uses PKCE).
- `ANTHROPIC_API_KEY` — from the
  [Anthropic Console](https://console.anthropic.com/settings/keys).

Copy `categories.example.json` to `categories.json` and edit it to your own
vibes (name + short description each).

## Usage

```bash
pnpm fetch
pnpm classify
pnpm report
# review/edit data/report.csv
pnpm apply --dry-run   # sanity check
pnpm apply             # actually create/update playlists
```

The first `fetch`/`classify`/`apply` call will print a Spotify authorize URL
to open in your browser; after that, a refresh token is cached in
`data/spotify_token.json` (gitignored) so you won't need to log in again.

## Future ideas (not implemented)

- Capturing songs from album radio / other algorithmic playback that aren't
  in your Liked Songs, e.g. by polling the "currently playing" endpoint
  while you listen and logging whatever plays.
- A lightweight player UI (Web Playback SDK, requires Premium) that shows
  the current track and lets you confirm/correct its category live instead
  of via the CSV review step.
