/* eslint-env node */
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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

const withMDX = createMDX({
  // Add markdown plugins here, if desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);