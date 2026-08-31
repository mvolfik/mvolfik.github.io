import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const dataDir = path.join(here, "..", "data");

export function dataPath(file: string): string {
  return path.join(dataDir, file);
}

export function readJson<T>(file: string, fallback: T): T {
  const p = dataPath(file);
  if (!existsSync(p)) return fallback;
  return JSON.parse(readFileSync(p, "utf-8")) as T;
}

export function writeJson(file: string, value: unknown): void {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(dataPath(file), JSON.stringify(value, null, 2));
}

export function ensureDataDir(): void {
  mkdirSync(dataDir, { recursive: true });
}
