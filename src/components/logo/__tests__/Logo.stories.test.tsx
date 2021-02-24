describe('components/logo/Logo', () => {
    test('looks visually correct when using story %s', async () => {
        const image = await BoxVisualTestUtils.takeScreenshot('logo');
        return expect(image).toMatchImageSnapshot();
    });
});
