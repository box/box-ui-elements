describe('components/image-tooltip/ImageTooltip', () => {
    test.each([['components-imagetooltip--basic']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
