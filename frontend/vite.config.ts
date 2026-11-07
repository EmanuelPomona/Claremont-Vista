import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // The worktree-root .env is written by scripts/bootstrap.sh
  const env = loadEnv(mode, '..', '')
  return {
    envDir: '..',
    plugins: [react()],
    server: {
      port: Number(env.FRONTEND_PORT) || 3001,
      strictPort: true,
    },
    preview: {
      port: Number(env.FRONTEND_PORT) || 3001,
      strictPort: true,
    },
  }
})
