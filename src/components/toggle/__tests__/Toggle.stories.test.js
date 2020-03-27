describe('components/toggle/Toggle', () => {
    test.each([
        ['components-toggle--basic'],
        ['components-toggle--right-aligned'],
        ['components-toggle--controlled'],
        ['components-toggle--disabled'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
