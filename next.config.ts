// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // Esto reemplaza `next export` y genera sitio estático
};

export default nextConfig;
