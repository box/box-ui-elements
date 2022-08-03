declare module '*.md' {
    const content: string;
    export = content;
}

namespace BoxVisualTestUtils {
    import { Page } from 'puppeteer';

    async function gotoStory(id: string): Promise<Page>;

    async function takeScreenshot(id: string): Promise<Buffer>;

    async function takeScreenshotAfterInput(id: string, selector: string, action?: string, userInput?: string, afterInputSelector?: string): Promise<Buffer>;

    async function takeModalScreenshot(id: string, width?: number, height?: number): Promise<Buffer>;

    async function blurInput(selector: string): Promise<void>;

    async function clearInput(selector: string, page: Page): Promise<void>;

    async function sleep(time?: number): Promise<void>;
}
