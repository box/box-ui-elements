describe('components/category-selector/CategorySelector', () => {
    test.each([['components-categoryselector--basic'], ['components-categoryselector--with-dropdown']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
