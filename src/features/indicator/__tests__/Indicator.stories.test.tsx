describe('components/indicator/Indicator', () => {
    test.each([['components-indicator--basic']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
