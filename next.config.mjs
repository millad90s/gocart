/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'minio',
                port: '9000',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
