describe('components/text-input-with-copy-button/TextInputWithCopyButton', () => {
    const STORY = 'components-textinputwithcopybutton--example';

    test(`looks visually correct when using story ${STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('updates copy button on click', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(STORY, 'button');
        await BoxVisualTestUtils.sleep(1000); // wait for background color animation to finish
        return expect(image).toMatchImageSnapshot();
    });
});
