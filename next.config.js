/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable service worker generation in development mode
  webpack: (config, { dev, isServer }) => {
    // Only generate service workers in production mode
    if (dev) {
      // In development mode, disable workbox service worker generation
      config.plugins = config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'GenerateSW' && 
               plugin.constructor.name !== 'InjectManifest';
      });
    }
    
    return config;
  }
};

module.exports = nextConfig;