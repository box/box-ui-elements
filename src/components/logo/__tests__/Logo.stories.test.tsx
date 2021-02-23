describe('components/logo/Logo', () => {
    test.each([['logo']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
