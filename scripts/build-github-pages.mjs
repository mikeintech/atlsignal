import { spawnSync } from "node:child_process";
import "./prepare-github-pages.mjs";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
  },
});

await import("./restore-github-pages.mjs");
process.exit(result.status ?? 1);
