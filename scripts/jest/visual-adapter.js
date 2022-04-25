// @flow
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

// testing utility functions

// Visual tests can take longer
jest.setTimeout(60000);

const MODAL_LOADING_ANIMATION_TIME = 2000;
const BUTTON_SELECTOR = 'button';

// Set of comming utils for visual testing
// When updating, also update .storybook/typings.d.ts
const BoxVisualTestUtils = {
    // Removes animations
    resetCSS: async () => {
        await global.page.addStyleTag({ path: './scripts/jest/visual-test-reset.css' });
    },

    gotoStory: async id => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`, {
            waitUntil: 'networkidle2', // wait for fonts etc.
        });

        return global.page;
    },

    // Takes image screenshots
    takeScreenshot: async id => {
        await BoxVisualTestUtils.gotoStory(id);
        return global.page.screenshot();
    },

    // Takes image screenshots after user input, e.g., clicking or entering text
    takeScreenshotAfterInput: async (id, selector, action = 'click', userInput) => {
        await BoxVisualTestUtils.gotoStory(id);
        await global.page.waitForSelector(selector);
        await global.page[action](selector, userInput);
        await global.page.waitFor(100);
        return global.page.screenshot();
    },

    // Takes image screenshots for modals
    takeModalScreenshot: async (id, width = 800, height = 800) => {
        await global.page.setViewport({ width, height });
        await BoxVisualTestUtils.gotoStory(id);
        await global.page.waitForSelector(BUTTON_SELECTOR);
        await global.page.click(BUTTON_SELECTOR);
        await global.page.waitFor(MODAL_LOADING_ANIMATION_TIME); // wait for modal loading animation to finish
        return global.page.screenshot();
    },

    // Blurs an input field
    blurInput: async selector => {
        await global.page.$eval(selector, e => e.blur());
        await global.page.waitFor(100);
    },

    // Clears an input field - https://evanhalley.dev/post/clearing-input-field-puppeteer/
    clearInput: async (selector, page = global.page) => {
        const inputElement = await page.$(selector);
        await inputElement.click({ clickCount: 3 });
        await inputElement.press('Backspace');
    },

    // Random waits, useful for animations to finish
    sleep: async (time = 3000) => global.page.waitFor(time),
};

global.BoxVisualTestUtils = BoxVisualTestUtils;
