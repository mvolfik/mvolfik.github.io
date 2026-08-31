import { readFileSync } from "node:fs";
import { dataPath } from "./store.js";
import { env } from "./env.js";
import {
  addTracksToPlaylist,
  findOrCreatePlaylist,
  getCurrentUserId,
  getPlaylistTrackIds,
} from "./spotifyApi.js";

const UNSORTED = "unsorted";
const UNCLASSIFIED = "unclassified";

interface Row {
  trackId: string;
  name: string;
  category: string;
}

function parseCsv(text: string): Row[] {
  const lines = text.split("\n").filter((l) => l.length > 0);
  const rows: Row[] = [];
  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line);
    const [trackId, name, , , category] = fields;
    rows.push({ trackId, name, category });
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

export async function runApply(opts: { dryRun: boolean }): Promise<void> {
  const rows = parseCsv(readFileSync(dataPath("report.csv"), "utf-8"));

  const byCategory = new Map<string, Row[]>();
  for (const row of rows) {
    if (
      !row.category ||
      row.category === UNSORTED ||
      row.category === UNCLASSIFIED
    )
      continue;
    const list = byCategory.get(row.category) ?? [];
    list.push(row);
    byCategory.set(row.category, list);
  }

  if (byCategory.size === 0) {
    console.log("Nothing to apply: no rows have a category assigned yet.");
    return;
  }

  const userId = opts.dryRun ? "" : await getCurrentUserId();

  for (const [category, categoryRows] of byCategory) {
    const playlistName = `${env.playlistPrefix}${category}`;
    if (opts.dryRun) {
      console.log(
        `[dry-run] ${playlistName}: would ensure ${categoryRows.length} tracks are present.`,
      );
      continue;
    }
    const playlistId = await findOrCreatePlaylist(userId, playlistName);
    const existingIds = await getPlaylistTrackIds(playlistId);
    const missing = categoryRows
      .map((r) => r.trackId)
      .filter((id) => !existingIds.has(id));
    if (missing.length > 0) {
      await addTracksToPlaylist(playlistId, missing);
    }
    console.log(
      `${playlistName}: ${categoryRows.length} tracks total, added ${missing.length} new (${existingIds.size} already there).`,
    );
  }
}
