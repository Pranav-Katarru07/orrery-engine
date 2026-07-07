import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5199, strictPort: true },
  build: { chunkSizeWarningLimit: 1500 },
});
