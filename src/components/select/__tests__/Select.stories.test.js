describe('components/select/Select', () => {
    test.each([
        ['components-select--basic'],
        ['components-select--disabled'],
        ['components-select--withErrorMessage'],
        ['components-select--withErrorOutline'],
    ])('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        expect(image).toMatchImageSnapshot();
    });
});
