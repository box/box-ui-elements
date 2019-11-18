declare module '*.md' {
    const content: string;
    export = content;
}

declare function takeScreenshot(id: string): void;
