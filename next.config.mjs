/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static HTML export
  images: {
    unoptimized: true, // Needed when exporting static for Next.js Image
  },
};

export default nextConfig;
