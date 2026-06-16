/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors now fail the build — the strict tsconfig is only worth anything if
  // the build actually enforces it.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
