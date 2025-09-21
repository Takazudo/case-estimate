/* eslint-env node */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  // Only allow ngrok in development mode
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const cspValue = isDevelopment
      ? "frame-ancestors 'self' https://*.ngrok-free.app"
      : "frame-ancestors 'self'";

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
