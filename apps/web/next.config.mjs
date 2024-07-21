/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "localhost:8000"
            }
        ]
    }
};

export default nextConfig
