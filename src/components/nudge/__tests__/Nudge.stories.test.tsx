describe('components/nudge/Nudge', () => {
    test.each([['components-nudge--regular']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
