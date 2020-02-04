describe('components/form-elements/text-area/TextArea', () => {
    const TEXTAREA_SELECTOR = 'textarea';
    const TEXTAREA_STORIES = [
        'components-form-elements-textarea--basic',
        'components-form-elements-textarea--with-validation',
    ];

    test.each(TEXTAREA_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('shows text after typing', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(
            TEXTAREA_STORIES[0],
            TEXTAREA_SELECTOR,
            'type',
            'zyxwv',
        );
        return expect(image).toMatchImageSnapshot();
    });

    test.each(['abcde', 'www'])('validates text when given input %s', async userInput => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${TEXTAREA_STORIES[1]}`);
        await global.page.waitForSelector(TEXTAREA_SELECTOR);
        await global.page.type(TEXTAREA_SELECTOR, userInput);
        await BoxVisualTestUtils.blurInput(TEXTAREA_SELECTOR);
        const image = await global.page.screenshot();
        await BoxVisualTestUtils.clearInput(TEXTAREA_SELECTOR);
        return expect(image).toMatchImageSnapshot();
    });
});
