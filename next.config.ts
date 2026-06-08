import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "iyndmediyprgeoyvsuvs.supabase.co" },
      { protocol: "https", hostname: "khfpbpboffjznpupncfk.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.legrand.com" },
      { protocol: "https", hostname: "www.iek.ru" },
      { protocol: "https", hostname: "systeme.ru" },
      { protocol: "https", hostname: "slet.asia" },
      { protocol: "https", hostname: "adverso.kz" },
      { protocol: "https", hostname: "*.trycloudflare.com" },
    ],
  },
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "trycloudflare.com",
  ],
};

export default nextConfig;
