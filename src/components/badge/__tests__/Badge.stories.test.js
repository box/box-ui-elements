describe('components/badge/Badge', () => {
    test.each([['components-badge--regular']])('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
