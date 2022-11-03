describe('components/badge/Badge', () => {
    test.each([
        ['components-badges-badge--regular'],
        ['components-badges-badge--info'],
        ['components-badges-badge--warning'],
        ['components-badges-badge--highlight'],
        ['components-badges-badge--error'],
        ['components-badges-badge--alert'],
        ['components-badges-badge--success'],
        ['components-badges-badge--beta-badge'],
        ['components-badges-badge--trial-badge'],
        ['components-badges-badge--upgrade-badge'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
