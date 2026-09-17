import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.STORYBOOK_VRT_PORT || 6061);
const HOST = process.env.STORYBOOK_VRT_HOST || '127.0.0.1';
const BASE_URL = process.env.STORYBOOK_VRT_URL || `http://${HOST}:${PORT}`;

/**
 * Playwright visual regression config for Storybook stories.
 * Viewport, delay, and diff threshold mirror Chromatic settings in `.storybook/preview.tsx`.
 */
export default defineConfig({
    testDir: './test/visual',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
    outputDir: 'test-results',
    timeout: 30_000,
    expect: {
        timeout: 15_000,
        toHaveScreenshot: {
            animations: 'disabled',
            caret: 'hide',
            // Chromatic `diffThreshold` is a per-pixel color tolerance (0–1).
            threshold: 0.1,
            scale: 'css',
        },
    },
    use: {
        baseURL: BASE_URL,
        browserName: 'chromium',
        viewport: { width: 1200, height: 1000 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'node scripts/serve-storybook.js',
        url: `${BASE_URL}/iframe.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
