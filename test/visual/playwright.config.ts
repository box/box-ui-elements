import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.VISUAL_PORT || 6061);
const repoRoot = path.resolve(__dirname, '../..');

/**
 * Screenshots the statically built Storybook (`yarn build:prod:storybook` -> `storybook/`).
 *
 * - Chromium only: Chromatic snapshots Chrome only, so this matches today's coverage.
 * - Baselines are platform-suffixed; only `*-linux.png` from the Playwright Docker image are CI-valid.
 * - `http-server`, not `serve`: `serve` 301s `/iframe.html?id=...` to `/iframe` and drops the query.
 */
export default defineConfig({
    testDir: '.',
    testMatch: '*.spec.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', { outputFolder: path.join(repoRoot, 'reports/visual'), open: 'never' }]],
    outputDir: path.join(repoRoot, 'reports/visual-results'),
    snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
    expect: {
        toHaveScreenshot: {
            animations: 'disabled',
            caret: 'hide',
            threshold: 0.1,
        },
    },
    use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://127.0.0.1:${PORT}`,
        viewport: { width: 1200, height: 1000 },
        locale: 'en-US',
        // Story play functions assert UTC dates (e.g. ContentExplorer "Dec 8, 2022"), as Chromatic renders in UTC.
        timezoneId: 'UTC',
    },
    projects: [{ name: 'chromium' }],
    webServer: {
        command: `yarn http-server storybook -a 127.0.0.1 -p ${PORT} -s -c-1`,
        cwd: repoRoot,
        url: `http://127.0.0.1:${PORT}/index.json`,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
