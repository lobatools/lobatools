import { defineConfig } from '@playwright/test'

const PORT = 5180
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL,
    channel: 'chrome',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      testMatch: /desktop\.spec\.ts/,
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      testMatch: /mobile\.spec\.ts/,
      use: { viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
