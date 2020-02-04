describe('components/link/LinkPrimaryButton', () => {
    test.each([
        'components-links-linkprimarybutton--basic',
        'components-links-linkprimarybutton--with-custom-component',
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
