/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bgtsyduuswexehscoaha.supabase.co',
            },
        ],
    },
};

export default nextConfig;
