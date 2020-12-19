describe('components/breadcrumb/CategorySelector', () => {
    test.each([['components-category-selector--regular']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
