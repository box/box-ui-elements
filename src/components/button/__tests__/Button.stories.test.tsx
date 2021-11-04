describe('components/button/Button', () => {
    test.each([
        ['components-buttons-button--regular'],
        ['components-buttons-button--disabled'],
        ['components-buttons-button--large'],
        ['components-buttons-button--icon-button'],
        ['components-buttons-button--icon-and-text-button'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
