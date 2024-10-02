/** @type {import('next').NextConfig} */
const nextConfig = {experimental: {
    serverActions: {
      allowedOrigins: ["testtxncdn.payubiz.in", "localhost:3000"]
    }
  }};
export default nextConfig;
