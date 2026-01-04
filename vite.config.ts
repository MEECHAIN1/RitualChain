// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['ox'] // 🔮 Deduplicate ox across nested dependencies
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ritualCore: [
            '@base-org/account',
            '@coinbase/wallet-sdk',
            '@wagmi/connectors'
          ],
          uiMagic: [
            '@reown/appkit',
            '@reown/appkit-controllers'
          ]
        }
      }
    }
  }
});