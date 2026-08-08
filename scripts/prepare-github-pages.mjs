import { mkdirSync, renameSync, existsSync } from "node:fs";

mkdirSync(".github-pages-disabled/app/atlanta", { recursive: true });

const moves = [
  ["app/api", ".github-pages-disabled/app/api"],
  ["app/atlanta/editorial-review", ".github-pages-disabled/app/atlanta/editorial-review"],
];

for (const [path, hidden] of moves) {
  if (existsSync(path) && !existsSync(hidden)) renameSync(path, hidden);
}
