describe('components/ghost/Ghost', () => {
    test.each([
        ['components-ghost--regular'],
        ['components-ghost--without-animation'],
        ['components-ghost--circle'],
        ['components-ghost--rectangle'],
        ['components-ghost--pill'],
        ['components-ghost--complicated-layout'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
