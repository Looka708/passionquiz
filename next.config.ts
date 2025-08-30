import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // a work-around to make the on-demand entries ping interval shorter for app hosting
    if (process.env.FIREBASE_APP_HOSTING_URL) {
      if (isServer) {
        config.watchOptions ??= {};
        config.watchOptions.poll = 500;
        config.watchOptions.aggregateTimeout = 300;
      } else {
        const hmrEntry =
          'webpack-hot-middleware/client?path=/__next/__webpack_hmr&page=%2F_error&assetPrefix=_next';
        const pingInterval = '&pingInterval=500';
        if (typeof config.entry === 'function') {
          const prevEntry = config.entry;
          config.entry = async () => {
            const entries = await prevEntry();
            for (const key of Object.keys(entries)) {
              const entry = entries[key];
              if (
                Array.isArray(entry) &&
                entry.length > 0 &&
                typeof entry[0] === 'string' &&
                entry[0].startsWith(hmrEntry)
              ) {
                entry[0] = entry[0] + pingInterval;
              }
            }
            return entries;
          };
        }
      }
    }
    return config;
  },
};

export default nextConfig;
