import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  devIndicators: false,
  allowedDevOrigins: ["terminal.local"],
  images: { unoptimized: true },
};
export default config;
