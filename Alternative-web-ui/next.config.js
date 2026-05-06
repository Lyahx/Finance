/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multi-stage Docker / Railway için minimal image
  output: "standalone",

  // Unsplash placeholder ve dicebear avatar gibi external host'lar için
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },

  // Container içinde dosya değişikliği takibini polling ile (gerekirse)
  // experimental: { instrumentationHook: true },
};

module.exports = nextConfig;
