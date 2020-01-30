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
        await global.page.goto(`http://localhost:6061/iframe.html?id=${DATEPICKER_STORIES[2]}`);
        await global.page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR);
        await global.page.type(INPUT_SELECTOR, '1/28/2020');
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
