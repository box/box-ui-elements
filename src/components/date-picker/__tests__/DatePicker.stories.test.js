describe('components/date-picker/DatePicker', () => {
    const DATEPICKER_STORIES = [
        'components-datepicker--basic',
        'components-datepicker--with-description',
        'components-datepicker--manually-editable',
        'components-datepicker--disabled-with-error-message',
        'components-datepicker--custom-error-tooltip-position',
        'components-datepicker--with-range',
    ];

    test.each(DATEPICKER_STORIES)('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        selector                    | description
        ${'.date-picker-open-btn'}  | ${'shows calendar and date'}
        ${'.date-picker-clear-btn'} | ${'closes calendar and clears date'}
    `(`$description for ${DATEPICKER_STORIES[0]}`, async ({ selector }) => {
        const image = await takeScreenshotAfterInput(DATEPICKER_STORIES[0], selector);
        return expect(image).toMatchImageSnapshot();
    });

    test(`allows editing in story ${DATEPICKER_STORIES[2]}`, async () => {
        const image = await takeScreenshotAfterInput(DATEPICKER_STORIES[2], 'input', 'type', '1/28/2020');
        return expect(image).toMatchImageSnapshot();
    });
});
