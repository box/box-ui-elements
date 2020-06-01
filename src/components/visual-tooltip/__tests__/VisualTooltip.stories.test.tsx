describe('components/visual-tooltip/VisualTooltip', () => {
    test.each([['components-visualtooltip--basic']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
