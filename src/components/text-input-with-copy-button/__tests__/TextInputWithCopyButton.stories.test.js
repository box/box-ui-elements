describe('components/text-input-with-copy-button/TextInputWithCopyButton', () => {
    const STORY = 'components-textinputwithcopybutton--example';

    test(`looks visually correct when using story ${STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('updates copy button on click', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(STORY, 'button');
        return expect(image).toMatchImageSnapshot();
    });
});
