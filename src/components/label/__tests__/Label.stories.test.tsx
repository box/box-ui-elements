describe('components/label/Label', () => {
    test.each([
        ['components-label--basic'],
        ['components-label--with-optional-text'],
        ['components-label--with-info-tooltip'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
