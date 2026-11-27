import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

function readCommit(): string {
  try {
    return (
      execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim() || 'dev'
    )
  } catch {
    return 'dev'
  }
}

const commit = readCommit()

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_COMMIT__: JSON.stringify(commit || 'dev'),
  },
  server: {
    port: 5173,
  },
})
