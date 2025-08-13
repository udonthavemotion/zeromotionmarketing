import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm preview --port 4321',
		port: 4321,
		reuseExistingServer: !process.env.CI,
	},
	testDir: './tests',
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: 'http://localhost:4321',
		viewport: { width: 1024, height: 768 },
		headless: true,
	},
	projects: [
		{ name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
		{ name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
	],
}); 