import puppeteer from 'puppeteer';

describe('components/time-input/TimeInput', () => {
    const INPUT_SELECTOR = 'input';
    const TIMEINPUT_STORY = 'components-timeinput--basic';

    test(`looks correct when using story ${TIMEINPUT_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(TIMEINPUT_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('sets a valid date based on input', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:6061/iframe.html?id=${TIMEINPUT_STORY}`);
        await page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR, page);
        await page.type(INPUT_SELECTOR, '11:51 p.m.');
        await page.$eval(INPUT_SELECTOR, element => (element as HTMLInputElement).blur());
        const image = await page.screenshot();
        await browser.close();
        return expect(image).toMatchImageSnapshot();
    });

    test('shows an error for invalid input', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:6061/iframe.html?id=${TIMEINPUT_STORY}`);
        await page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR, page);
        await page.type(INPUT_SELECTOR, 'abcde');
        await page.$eval(INPUT_SELECTOR, element => (element as HTMLInputElement).blur());
        const image = await page.screenshot();
        await browser.close();
        return expect(image).toMatchImageSnapshot();
    });
});
