import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, 'assets');

function serveAssetsPlugin() {
  return {
    name: 'serve-root-assets',
    configureServer(server) {
      server.middlewares.use('/assets', (req, res, next) => {
        const filePath = path.join(assetsDir, req.url || '');
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).slice(1);
          const types = { svg: 'image/svg+xml', png: 'image/png', ttf: 'font/ttf' };
          res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    serveAssetsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: '❤️U Festival',
        short_name: '❤️U',
        description: 'De officiële app voor het ❤️U Festival in Utrecht',
        theme_color: '#F03228',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,woff,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.youtube\.com\/embed\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-embeds',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ]
});
