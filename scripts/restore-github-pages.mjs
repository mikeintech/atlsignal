import { renameSync, existsSync } from "node:fs";

const moves = [
  ["app/api", ".github-pages-disabled/app/api"],
  ["app/atlanta/editorial-review", ".github-pages-disabled/app/atlanta/editorial-review"],
];

for (const [path, hidden] of moves) {
  if (existsSync(hidden) && !existsSync(path)) renameSync(hidden, path);
}
