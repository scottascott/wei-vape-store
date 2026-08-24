import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" output is only for self-hosting (our Dockerfile copies
  // .next/standalone). Vercel has its own serverless packaging and gets
  // confused by this mode (fails post-build looking for a .nft.json file
  // that standalone mode doesn't produce), so skip it there — Vercel sets
  // the VERCEL env var automatically during its builds.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
