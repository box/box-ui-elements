describe('components/badge/Badge', () => {
    test.each([
        ['components-badge--regular'],
        ['components-badge--info'],
        ['components-badge--warning'],
        ['components-badge--highlight'],
        ['components-badge--error'],
        ['components-badge--alert'],
        ['components-badge--success'],
        ['components-badge--beta-badge'],
        ['components-badge--trial-badge'],
        ['components-badge--upgrade-badge'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
