import { readJson, dataPath, ensureDataDir } from "./store.js";
import { writeFileSync } from "node:fs";
import type { Classification, TrackRecord } from "./types.js";

const TRACKS_FILE = "tracks.json";
const CLASSIFICATIONS_FILE = "classifications.json";
const UNCLASSIFIED = "unclassified";

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function runReport(): Promise<void> {
  const tracks = readJson<Record<string, TrackRecord>>(TRACKS_FILE, {});
  const classifications = readJson<Record<string, Classification>>(
    CLASSIFICATIONS_FILE,
    {},
  );

  const rows = Object.values(tracks).map((track) => {
    const c = classifications[track.id];
    return {
      track,
      category: c?.category ?? UNCLASSIFIED,
      confidence: c?.confidence ?? "",
      reason: c?.reason ?? "",
    };
  });

  const byCategory = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = byCategory.get(row.category) ?? [];
    list.push(row);
    byCategory.set(row.category, list);
  }

  const orderedCategories = [...byCategory.keys()].sort((a, b) => {
    if (a === UNCLASSIFIED) return 1;
    if (b === UNCLASSIFIED) return -1;
    if (a === "unsorted") return 1;
    if (b === "unsorted") return -1;
    return byCategory.get(b)!.length - byCategory.get(a)!.length;
  });

  const mdLines: string[] = ["# Vibe sort report", ""];
  for (const category of orderedCategories) {
    const list = byCategory.get(category)!;
    mdLines.push(`## ${category} (${list.length})`, "");
    for (const row of list) {
      const artists = row.track.artistNames.join(", ");
      mdLines.push(
        `- **${row.track.name}** — ${artists}${row.confidence ? ` _(${row.confidence}: ${row.reason})_` : ""}`,
      );
    }
    mdLines.push("");
  }
  ensureDataDir();
  writeFileSync(dataPath("report.md"), mdLines.join("\n"));

  const csvLines = [
    "track_id,name,artists,album,category,confidence,reason,spotify_url",
    ...rows.map((row) =>
      [
        row.track.id,
        row.track.name,
        row.track.artistNames.join("; "),
        row.track.album,
        row.category,
        row.confidence,
        row.reason,
        row.track.url,
      ]
        .map(csvField)
        .join(","),
    ),
  ];
  writeFileSync(dataPath("report.csv"), csvLines.join("\n"));

  console.log(
    `Wrote data/report.md and data/report.csv (${rows.length} tracks).`,
  );
  console.log(
    "Edit the `category` column in report.csv to correct any mistakes, then run `apply`.",
  );
  for (const category of orderedCategories) {
    console.log(`  ${category}: ${byCategory.get(category)!.length}`);
  }
}
