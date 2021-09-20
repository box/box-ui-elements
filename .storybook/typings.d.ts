declare module '*.md' {
    const content: string;
    export = content;
}

namespace BoxVisualTestUtils {
    import { Page } from 'puppeteer';
    
    async function takeScreenshot(id: string): Promise<Buffer>;

    async function takeScreenshotAfterInput(id: string, selector: string, action?: string, userInput?: string): Promise<Buffer>;

    async function takeModalScreenshot(id: string): Promise<Buffer>;

    async function blurInput(selector: string): Promise<void>;

    async function clearInput(selector: string, page: Page): Promise<void>;

    async function sleep(time?: number): Promise<void>;
}
