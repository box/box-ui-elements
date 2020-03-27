describe('components/tooltip/Tooltip', () => {
    test.each([
        ['components-tooltip--top-left'],
        ['components-tooltip--top-center'],
        ['components-tooltip--callout-theme'],
        ['components-tooltip--with-close-button'],
        ['components-tooltip--error-theme'],
        ['components-tooltip--with-long-text'],
        ['components-tooltip--shown-by-default'],
        ['components-tooltip--bottom-left'],
        ['components-tooltip--bottom-center'],
        ['components-tooltip--bottom-right'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, 'button', 'focus');
        return expect(image).toMatchImageSnapshot();
    });
});
