describe('components/text-input/TextInput', () => {
    const TEXTINPUT_STORIES = [
        'components-textinput--basic',
        'components-textinput--with-description',
        'components-textinput--with-long-breakable-strings',
        'components-textinput--with-long-unbreakable-strings',
        'components-textinput--error',
        'components-textinput--valid',
        'components-textinput--required-with-on-change',
    ];

    test.each(TEXTINPUT_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('clears required tooltip after entering text', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(
            TEXTINPUT_STORIES[6],
            'input',
            'type',
            'abc@xyz.com',
        );
        return expect(image).toMatchImageSnapshot();
    });
});
