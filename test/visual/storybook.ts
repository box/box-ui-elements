import * as fs from 'fs';
import * as path from 'path';
import type { Page } from '@playwright/test';

const STORYBOOK_INDEX_PATH = path.resolve(__dirname, '../../storybook/index.json');
const CONTENT_PICKER_VISUAL_STORIES_PATH = 'ContentPicker-visual.stories';
const LOADING_COPY = 'Please wait while the items load...';
// Matches `parameters.chromatic.delay` in `.storybook/preview.tsx`.
const CHROMATIC_SETTLE_DELAY_MS = 500;

export type StorybookIndexEntry = {
    id: string;
    title: string;
    name: string;
    importPath?: string;
    type?: string;
    tags?: string[];
};

type StorybookIndex = {
    entries?: Record<string, StorybookIndexEntry>;
    stories?: Record<string, StorybookIndexEntry>;
};

type StorybookPreview = {
    storyRenders?: Array<{ phase?: string }>;
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function readStorybookIndex(): StorybookIndex {
    if (!fs.existsSync(STORYBOOK_INDEX_PATH)) {
        throw new Error(
            `Storybook index not found at ${STORYBOOK_INDEX_PATH}. Run \`yarn build:prod:storybook\` before Playwright visual tests.`,
        );
    }

    return JSON.parse(fs.readFileSync(STORYBOOK_INDEX_PATH, 'utf8')) as StorybookIndex;
}

export function getContentPickerVisualStories(): StorybookIndexEntry[] {
    const index = readStorybookIndex();
    const entries = Object.values(index.entries || index.stories || {});

    const stories = entries.filter(entry => {
        const isStory = !entry.type || entry.type === 'story';
        const isVisualSuite = (entry.importPath || '').includes(CONTENT_PICKER_VISUAL_STORIES_PATH);
        return isStory && isVisualSuite;
    });

    if (stories.length === 0) {
        throw new Error(
            `No ContentPicker visual stories found in ${STORYBOOK_INDEX_PATH}. Expected stories imported from ${CONTENT_PICKER_VISUAL_STORIES_PATH}.`,
        );
    }

    return stories.sort((a, b) => a.id.localeCompare(b.id));
}

async function waitForStoryRenderToFinish(page: Page): Promise<void> {
    await page.waitForFunction(() => {
        const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: StorybookPreview }).__STORYBOOK_PREVIEW__; // eslint-disable-line no-underscore-dangle
        const renders = preview?.storyRenders;
        if (!Array.isArray(renders) || renders.length === 0) {
            return false;
        }

        const phase = renders[renders.length - 1]?.phase;
        return phase === 'finished' || phase === 'errored' || phase === 'aborted';
    });

    const phase = await page.evaluate(() => {
        const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: StorybookPreview }).__STORYBOOK_PREVIEW__; // eslint-disable-line no-underscore-dangle
        const renders = preview?.storyRenders || [];
        return renders[renders.length - 1]?.phase;
    });

    if (phase !== 'finished') {
        throw new Error(`Storybook story did not finish successfully (phase: ${phase || 'unknown'})`);
    }

    const errorOverlay = page.locator('.sb-errordisplay, #error-message');
    if (
        await errorOverlay
            .first()
            .isVisible()
            .catch(() => false)
    ) {
        const message = await errorOverlay
            .first()
            .innerText()
            .catch(() => '');
        throw new Error(`Storybook error overlay was visible${message ? `: ${message}` : ''}`);
    }
}

async function waitForContentPickerToSettle(page: Page): Promise<void> {
    const picker = page.getByTestId('content-picker');
    await picker.waitFor({ state: 'visible' });
    await picker.getByText(LOADING_COPY).waitFor({ state: 'hidden' });
}

export async function gotoStory(page: Page, storyId: string): Promise<void> {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`, {
        waitUntil: 'domcontentloaded',
    });
    await waitForStoryRenderToFinish(page);
    await waitForContentPickerToSettle(page);
    await page.evaluate(() => document.fonts.ready);
    await delay(CHROMATIC_SETTLE_DELAY_MS);
}
