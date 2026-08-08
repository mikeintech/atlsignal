import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        distDir: ".next-github",
        basePath: githubPagesBasePath || undefined,
        assetPrefix: githubPagesBasePath || undefined,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
