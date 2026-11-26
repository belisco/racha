import { defineConfig, devices } from '@playwright/test'

const naCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: naCI,
  retries: naCI ? 1 : 0,
  reporter: naCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // roda contra o build de produção; o script e2e faz o build antes
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !naCI,
  },
})
