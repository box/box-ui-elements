import puppeteer from 'puppeteer';

describe('components/date-picker/DatePicker', () => {
    const INPUT_SELECTOR = 'input';
    const DATEPICKER_STORIES = [
        'components-datepicker--basic',
        'components-datepicker--with-description',
        'components-datepicker--manually-editable',
        'components-datepicker--disabled-with-error-message',
        'components-datepicker--custom-error-tooltip-position',
        'components-datepicker--with-range',
    ];

    test.each(DATEPICKER_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        selector                    | description
        ${'.date-picker-open-btn'}  | ${'shows calendar and date'}
        ${'.date-picker-clear-btn'} | ${'closes calendar and clears date'}
    `(`$description for ${DATEPICKER_STORIES[0]}`, async ({ selector }) => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(DATEPICKER_STORIES[0], selector);
        return expect(image).toMatchImageSnapshot();
    });

    test(`allows editing in story ${DATEPICKER_STORIES[2]}`, async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:6061/iframe.html?id=${DATEPICKER_STORIES[2]}`);
        await page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR, page);
        await page.type(INPUT_SELECTOR, '1/28/2020');
        const image = await page.screenshot();
        await browser.close();
        return expect(image).toMatchImageSnapshot();
    });
});
