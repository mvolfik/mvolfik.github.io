import path from "node:path";
import { runFetch } from "./fetchLibrary.js";
import { runClassify } from "./classify.js";
import { runReport } from "./report.js";
import { runApply } from "./apply.js";

function flag(args: string[], name: string): boolean {
  return args.includes(`--${name}`);
}

function option(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found?.slice(prefix.length);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "fetch":
      await runFetch();
      break;
    case "classify":
      await runClassify({
        categoriesPath: path.resolve(
          option(args, "categories") ?? "categories.json",
        ),
        force: flag(args, "force"),
        batchSize: option(args, "batch-size")
          ? Number(option(args, "batch-size"))
          : undefined,
      });
      break;
    case "report":
      await runReport();
      break;
    case "apply":
      await runApply({ dryRun: flag(args, "dry-run") });
      break;
    default:
      console.log(`Usage: tsx src/cli.ts <fetch|classify|report|apply> [flags]

  fetch                       Pull liked songs + artist genres from Spotify into data/
  classify [--categories=path] [--force] [--batch-size=N]
                               Classify tracks into vibe categories with Claude
                               (skips tracks already confidently classified, unless --force)
  report                      Write data/report.md and data/report.csv for review
  apply [--dry-run]           Create/update Spotify playlists from data/report.csv`);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
