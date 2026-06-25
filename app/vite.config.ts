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
    // Pin the dev-server port instead of letting Vite silently auto-increment
    // when its port is taken. That drift leaves a `cloudflared --url
    // http://localhost:<port>` tunnel pointing at a dead port, so the phone
    // gets a 502. strictPort makes Vite fail loudly instead, keeping the dev
    // server and tunnel in lockstep. 5180 (not the Vite default 5173): a
    // Windows svchost.exe squats 5173, and WSL2's localhost forwarding means a
    // WSL bind to 5173 collides with it and drifts to 5174.
    port: 5180,
    strictPort: true,
    // Allow ephemeral tunnel hosts (cloudflared/ngrok) so the dev server can
    // be reached over HTTPS from a phone for camera testing. Without this Vite
    // replies "Blocked request. This host is not allowed." A leading dot
    // matches all subdomains.
    allowedHosts: [
      '.trycloudflare.com',
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app',
    ],
    // WSL on /mnt/c paths doesn't deliver inotify events reliably —
    // poll so edits from the Windows side actually trigger HMR.
    watch: { usePolling: true, interval: 300 },
  },
})
