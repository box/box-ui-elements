describe('components/text-input-with-copy-button/TextInputWithCopyButton', () => {
    const STORY = 'components-textinputwithcopybutton--example';

    test(`looks visually correct when using story ${STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('updates copy button on click', async () => {
        const selector = 'button';
        await global.page.goto(`http://localhost:6061/iframe.html?id=${STORY}`);
        await BoxVisualTestUtils.resetCSS();
        await global.page.waitForSelector(selector);
        await global.page.click(selector);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
