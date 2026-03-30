import "./env-loader";
import type { NextConfig } from "next";
import { env } from "@cloud_cost_analyzer/env/web";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  // Pass env values here if needed or just rely on process.env
};

export default nextConfig;
