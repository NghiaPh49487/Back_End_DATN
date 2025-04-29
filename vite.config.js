import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './index.js',
      exportName: 'app', // export từ file index.js
    }),
  ],
  server: {
    port: 3000,
  },
});
