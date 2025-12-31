/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'zenv-hub.onrender.com' },
      { protocol: 'https', hostname: 'img.shields.io' }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true, // Important pour Cloudflare Free tier parfois
  },
};
module.exports = nextConfig;