declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}

type Fetcher = {
  fetch(request: Request): Promise<Response>;
};

type D1Database = unknown;

declare function getCloudflareContext(): {
  env: Record<string, unknown>;
};
