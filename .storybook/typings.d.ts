declare module '*.md' {
    const content: string;
    export = content;
}

declare function takeScreenshot(id: string): void;

declare async function takeModalScreenshot(id: string): Promise<Buffer>;

declare async function blurInput(selector: string): Promise<void>;

declare async function clearInput(selector: string): Promise<void>;
