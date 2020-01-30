describe('components/select-button/SelectButton', () => {
    test.each([
        ['components-selectbutton--regular'],
        ['components-selectbutton--disabled'],
        ['components-selectbutton--with-error'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
