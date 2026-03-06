import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js to treat these Node.js-only packages as server-side external
  // modules instead of bundling them. This prevents edge-runtime errors on Vercel
  // and avoids "Module not found" issues with native bindings (Prisma, bcryptjs).
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs'],
};

export default nextConfig;
