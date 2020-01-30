describe('components/select/Select', () => {
    test.each([
        'components-select--basic',
        'components-select--disabled',
        'components-select--with-error-message',
        'components-select--with-error-outline',
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
