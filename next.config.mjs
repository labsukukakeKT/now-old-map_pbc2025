/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bgtsyduuswexehscoaha.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'www.titech.ac.jp',
            },
        ],
    },
};

export default nextConfig;
