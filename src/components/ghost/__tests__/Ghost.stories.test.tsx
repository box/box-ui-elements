describe('components/ghost/Ghost', () => {
    test.each([['components-ghost--regular'], ['components-ghost--without-animation']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
