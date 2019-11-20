const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

// testing utility functions

// Takes image screenshots
global.takeScreenshot = async id => {
    await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
    return global.page.screenshot();
};
