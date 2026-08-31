import { fetchArtistGenres, fetchLikedTracks } from "./spotifyApi.js";
import { readJson, writeJson } from "./store.js";
import type { ArtistRecord, TrackRecord } from "./types.js";

const TRACKS_FILE = "tracks.json";
const ARTISTS_FILE = "artists.json";

export async function runFetch(): Promise<void> {
  const tracks = readJson<Record<string, TrackRecord>>(TRACKS_FILE, {});
  const artists = readJson<Record<string, ArtistRecord>>(ARTISTS_FILE, {});

  let newCount = 0;
  await fetchLikedTracks((page) => {
    for (const track of page) {
      if (!tracks[track.id]) newCount++;
      tracks[track.id] = track;
    }
  });
  console.log(
    `Fetched liked songs: ${Object.keys(tracks).length} total (${newCount} new).`,
  );

  const unknownArtistIds = [
    ...new Set(
      Object.values(tracks)
        .flatMap((t) => t.artistIds)
        .filter((id) => !artists[id]),
    ),
  ];
  if (unknownArtistIds.length > 0) {
    console.log(
      `Resolving genres for ${unknownArtistIds.length} new artists...`,
    );
    const resolved = await fetchArtistGenres(unknownArtistIds);
    for (const artist of resolved) artists[artist.id] = artist;
  }

  writeJson(TRACKS_FILE, tracks);
  writeJson(ARTISTS_FILE, artists);
  console.log("Saved data/tracks.json and data/artists.json.");
}
