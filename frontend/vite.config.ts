import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
}

export default defineConfig(config)
