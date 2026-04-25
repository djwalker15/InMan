import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // bind to 0.0.0.0 for WSL2 compatibility
    // WSL on /mnt/c paths doesn't deliver inotify events reliably —
    // poll so edits from the Windows side actually trigger HMR.
    watch: { usePolling: true, interval: 300 },
  },
})
