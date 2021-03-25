describe('components/logo/Logo', () => {
    test('looks visually correct when using story %s', async () => {
        const image = await BoxVisualTestUtils.takeScreenshot('components-logo--regular');
        return expect(image).toMatchImageSnapshot();
    });
});
