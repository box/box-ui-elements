describe('components/error-mask/ErrorMask', () => {
    test('looks visually correct when using story %s', async () => {
        const image = await BoxVisualTestUtils.takeScreenshot('components-errormask--regular');
        return expect(image).toMatchImageSnapshot();
    });
});
