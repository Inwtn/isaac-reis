import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false, reactStrictMode: true, devIndicators: false, agentRules: false,
  async redirects() { return [
    { source: "/en", destination: "/", permanent: true },
    { source: "/en/:path*", destination: "/:path*", permanent: true },
    { source: "/privacidade", destination: "/pt/privacidade", permanent: true },
    { source: "/trabalhos/:slug", destination: "/pt/trabalhos/:slug", permanent: true },
  ]; },
};
export default nextConfig;
