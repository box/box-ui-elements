// @flow
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

type TakeScreenshotParams = {
    action?: string,
    id: string,
    selector?: string,
    userInput?: string,
};

// testing utility functions

// Takes image screenshots
global.takeScreenshot = async id => {
    await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
    return global.page.screenshot();
};

// Takes image screenshots after user input, e.g., clicking or entering text
global.takeScreenshotAfterInput = async (id, selector, action = 'click', userInput): TakeScreenshotParams => {
    await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
    await global.page.waitForSelector(selector);
    await global.page[action](selector, userInput);
    return global.page.screenshot();
};

const MODAL_LOADING_ANIMATION_TIME = 2000;
const BUTTON_SELECTOR = 'button';

// Takes image screenshots for modals
global.takeModalScreenshot = async id => {
    await global.page.setViewport({ width: 800, height: 800 });
    await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
    await global.page.waitForSelector(BUTTON_SELECTOR);
    await global.page.click(BUTTON_SELECTOR);
    await global.page.waitFor(MODAL_LOADING_ANIMATION_TIME); // wait for modal loading animation to finish
    return global.page.screenshot();
};

// Blurs an input field
global.blurInput = async selector => global.page.$eval(selector, e => e.blur());
