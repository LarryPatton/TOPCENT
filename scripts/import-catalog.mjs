import { spawnSync } from "node:child_process";
import process from "node:process";

const candidates =
  process.platform === "win32"
    ? [
        { command: "py", args: ["-3"] },
        { command: "python", args: [] },
        { command: "python3", args: [] },
      ]
    : [
        { command: "python3", args: [] },
        { command: "python", args: [] },
      ];

let selected = null;

for (const candidate of candidates) {
  const result = spawnSync(candidate.command, [...candidate.args, "--version"], {
    encoding: "utf-8",
    stdio: "pipe",
    windowsHide: true,
  });

  if (result.status === 0) {
    selected = candidate;
    break;
  }
}

if (!selected) {
  console.error("Python 3 is required to import the catalog.");
  console.error("Install Python 3, then run npm run import:catalog again.");
  process.exit(1);
}

const result = spawnSync(
  selected.command,
  [...selected.args, "scripts/import_catalog.py", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    windowsHide: true,
  }
);

process.exit(result.status ?? 1);
