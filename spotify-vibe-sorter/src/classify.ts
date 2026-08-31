import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { env } from "./env.js";
import { readJson, writeJson } from "./store.js";
import type {
  ArtistRecord,
  Category,
  Classification,
  Confidence,
  TrackRecord,
} from "./types.js";

const TRACKS_FILE = "tracks.json";
const ARTISTS_FILE = "artists.json";
const CLASSIFICATIONS_FILE = "classifications.json";
const UNSORTED = "unsorted";
const BATCH_SIZE = 20;

let client: Anthropic | undefined;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: env.anthropicApiKey });
  return client;
}

function loadCategories(path: string): Category[] {
  const categories = JSON.parse(readFileSync(path, "utf-8")) as Category[];
  if (categories.length === 0)
    throw new Error(`No categories found in ${path}`);
  return categories;
}

function describeTrack(
  track: TrackRecord,
  artists: Record<string, ArtistRecord>,
): string {
  const genres = [
    ...new Set(track.artistIds.flatMap((id) => artists[id]?.genres ?? [])),
  ];
  const year = track.releaseDate?.slice(0, 4) ?? "unknown";
  return [
    `id: ${track.id}`,
    `title: ${track.name}`,
    `artists: ${track.artistNames.join(", ")}`,
    `album: ${track.album} (${year})`,
    `genres: ${genres.length > 0 ? genres.join(", ") : "unknown"}`,
    `popularity: ${track.popularity}/100`,
  ].join(" | ");
}

const CLASSIFY_TOOL: Anthropic.Tool = {
  name: "assign_categories",
  description: "Assign each given track to the single best-fit vibe category.",
  input_schema: {
    type: "object",
    properties: {
      assignments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            track_id: { type: "string" },
            category: {
              type: "string",
              description: `One of the given category names, or literally "${UNSORTED}" if none fit well.`,
            },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            reason: {
              type: "string",
              description: "One short clause explaining the pick.",
            },
          },
          required: ["track_id", "category", "confidence", "reason"],
        },
      },
    },
    required: ["assignments"],
  },
};

async function classifyBatch(
  batch: TrackRecord[],
  categories: Category[],
  artists: Record<string, ArtistRecord>,
): Promise<Map<string, Classification>> {
  const categoryList = categories
    .map((c) => `- "${c.name}": ${c.description}`)
    .join("\n");
  const trackList = batch.map((t) => describeTrack(t, artists)).join("\n");

  const message = await getClient().messages.create({
    model: env.classifyModel,
    max_tokens: 4096,
    tools: [CLASSIFY_TOOL],
    tool_choice: { type: "tool", name: "assign_categories" },
    messages: [
      {
        role: "user",
        content: `You are sorting a personal Spotify liked-songs library into "vibe" playlists based on track/artist metadata (no audio analysis available).

Categories:
${categoryList}

For each track below, pick the single best-fit category by name. If a track genuinely doesn't fit any category well, use "${UNSORTED}" rather than forcing a bad match. Judge from the title, artist(s), album, genres and era — use your knowledge of these artists/songs when the metadata alone is thin.

Tracks:
${trackList}`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) throw new Error("Model did not return a tool_use block.");

  const input = toolUse.input as {
    assignments: Array<{
      track_id: string;
      category: string;
      confidence: Confidence;
      reason: string;
    }>;
  };

  const result = new Map<string, Classification>();
  for (const a of input.assignments) {
    result.set(a.track_id, {
      category: a.category,
      confidence: a.confidence,
      reason: a.reason,
      classifiedAt: new Date().toISOString(),
    });
  }
  return result;
}

export async function runClassify(opts: {
  categoriesPath: string;
  force: boolean;
  batchSize?: number;
}): Promise<void> {
  const categories = loadCategories(opts.categoriesPath);
  const categoryNames = new Set(categories.map((c) => c.name));
  const tracks = readJson<Record<string, TrackRecord>>(TRACKS_FILE, {});
  const artists = readJson<Record<string, ArtistRecord>>(ARTISTS_FILE, {});
  const classifications = readJson<Record<string, Classification>>(
    CLASSIFICATIONS_FILE,
    {},
  );

  if (Object.keys(tracks).length === 0) {
    console.log("No tracks found. Run the fetch command first.");
    return;
  }

  const toClassify = Object.values(tracks).filter((track) => {
    if (opts.force) return true;
    const existing = classifications[track.id];
    if (!existing) return true;
    // Reuse a confident, still-valid assignment. Only "unsorted" tracks (or
    // ones whose old category got removed) get a shot at newly added categories.
    return (
      existing.category === UNSORTED || !categoryNames.has(existing.category)
    );
  });

  console.log(
    `${toClassify.length} of ${Object.keys(tracks).length} tracks need classification` +
      (opts.force
        ? " (--force)."
        : ` (reusing ${Object.keys(tracks).length - toClassify.length} cached assignments).`),
  );

  const batchSize = opts.batchSize ?? BATCH_SIZE;
  for (let i = 0; i < toClassify.length; i += batchSize) {
    const batch = toClassify.slice(i, i + batchSize);
    console.log(
      `Classifying ${i + 1}-${i + batch.length} of ${toClassify.length}...`,
    );
    const results = await classifyBatch(batch, categories, artists);
    for (const [id, classification] of results) {
      classifications[id] = classification;
    }
    writeJson(CLASSIFICATIONS_FILE, classifications);
  }

  console.log("Saved data/classifications.json.");
}
