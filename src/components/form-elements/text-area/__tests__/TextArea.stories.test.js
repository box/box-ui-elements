describe('components/form-elements/text-area/TextArea', () => {
    const TEXTAREA_STORIES = [
        'components-form-elements-textarea--basic',
        'components-form-elements-textarea--with-validation',
    ];

    test.each(TEXTAREA_STORIES)('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('shows text after typing', async () => {
        const image = await takeScreenshotAfterInput(TEXTAREA_STORIES[0], 'textarea', 'type', 'zyxwv');
        return expect(image).toMatchImageSnapshot();
    });

    test.each(['abcde', 'www'])('validates text when given input %s', async userInput => {
        const image = await takeScreenshotAfterInput(TEXTAREA_STORIES[1], userInput);
        return expect(image).toMatchImageSnapshot();
    });
});
