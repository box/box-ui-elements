import fs from 'fs';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';

const REPO_ROOT = path.resolve(__dirname, '../..');
const STORYBOOK_INDEX = path.join(REPO_ROOT, 'storybook/index.json');

// Story files migrated off Chromatic. To migrate one, add it here and remove its
// `chromatic.disableSnapshot: false`. Remove this list once every `*-visual.stories.*` file has moved.
const MIGRATED_STORY_FILES = [
    './src/elements/content-explorer/stories/tests/ContentExplorer-visual.stories.js',
    './src/elements/content-explorer/stories/tests/DeleteConfirmationDialog-visual.stories.js',
];
const CHROMATIC_OPT_IN = /disableSnapshot:\s*false/;

// Matches Chromatic's `delay: 500` in .storybook/preview.tsx.
const SETTLE_DELAY_MS = 500;

interface StorybookIndexEntry {
    id: string;
    type: 'story' | 'docs';
    title: string;
    importPath: string;
}

// Groups baselines by element and names them after the story, e.g. a `deleteDialogIsLoading` story
// titled `Elements/ContentExplorer/tests/...` -> `ContentExplorer/delete-dialog-is-loading.png`.
function getScreenshotName({ id, title }: StorybookIndexEntry): [string, string] {
    const folder = title.split('/')[1].replace(/\s+/g, '');
    const storyName = id.split('--')[1];
    return [folder, `${storyName}.png`];
}

type StorybookWindow = typeof globalThis & {
    __visualStoryDone?: boolean;
    __visualStoryError?: string;
    __STORYBOOK_ADDONS_CHANNEL__?: { on(event: string, listener: (...args: unknown[]) => void): void };
};

function loadStories(): StorybookIndexEntry[] {
    if (!fs.existsSync(STORYBOOK_INDEX)) {
        throw new Error(`${STORYBOOK_INDEX} not found. Run \`yarn build:prod:storybook\` first.`);
    }
    const { entries } = JSON.parse(fs.readFileSync(STORYBOOK_INDEX, 'utf-8')) as {
        entries: Record<string, StorybookIndexEntry>;
    };
    const files = new Set(MIGRATED_STORY_FILES);

    return Object.values(entries)
        .filter(entry => entry.type === 'story' && files.has(entry.importPath))
        .sort((a, b) => a.id.localeCompare(b.id));
}

// `storyRendered` fires after the play function completes; screenshotting earlier races `play`.
async function trackStoryLifecycle(page: Page): Promise<void> {
    await page.addInitScript(() => {
        /* eslint-disable no-underscore-dangle */
        const w = window as StorybookWindow;
        const attach = () => {
            const channel = w.__STORYBOOK_ADDONS_CHANNEL__;
            if (!channel) {
                setTimeout(attach, 10);
                return;
            }
            const fail = (payload: unknown) => {
                const { message, description } = (payload ?? {}) as { message?: string; description?: string };
                w.__visualStoryError = message ?? description ?? String(payload);
                w.__visualStoryDone = true;
            };
            channel.on('storyRendered', () => {
                w.__visualStoryDone = true;
            });
            channel.on('storyErrored', fail);
            channel.on('storyThrewException', fail);
            channel.on('playFunctionThrewException', fail);
        };
        attach();
        /* eslint-enable no-underscore-dangle */
    });
}

async function waitForStory(page: Page): Promise<void> {
    // eslint-disable-next-line no-underscore-dangle
    await page.waitForFunction(() => (window as StorybookWindow).__visualStoryDone === true, undefined, {
        timeout: 30_000,
    });
    // eslint-disable-next-line no-underscore-dangle
    const error = await page.evaluate(() => (window as StorybookWindow).__visualStoryError);
    expect(error, 'story or play function threw before the screenshot').toBeUndefined();

    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);
    await page.waitForTimeout(SETTLE_DELAY_MS);
}

const stories = loadStories();

test.describe('Storybook visual regression', () => {
    test('finds every migrated story file in the Storybook index', () => {
        const indexed = new Set(stories.map(story => story.importPath));
        const missing = MIGRATED_STORY_FILES.filter(file => !indexed.has(file));
        expect(missing, 'fix the path in MIGRATED_STORY_FILES, or rebuild Storybook').toEqual([]);
    });

    test('keeps migrated story files out of Chromatic', () => {
        const optedIn = MIGRATED_STORY_FILES.filter(file =>
            CHROMATIC_OPT_IN.test(fs.readFileSync(path.join(REPO_ROOT, file), 'utf-8')),
        );
        expect(optedIn, 'remove `chromatic.disableSnapshot: false` from these files').toEqual([]);
    });

    test('gives every story its own screenshot', () => {
        const names = stories.map(story => getScreenshotName(story).join('/'));
        const duplicates = [...new Set(names.filter((name, index) => names.indexOf(name) !== index))];
        expect(duplicates, 'rename stories that share a name within an element').toEqual([]);
    });

    test.beforeEach(async ({ page }) => {
        await trackStoryLifecycle(page);
    });

    for (const story of stories) {
        test(story.id, async ({ page }) => {
            await page.goto(`/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
            await waitForStory(page);
            // Full page, not `#storybook-root`: dialogs portal into elements appended to <body>.
            await expect(page).toHaveScreenshot(getScreenshotName(story));
        });
    }
});
