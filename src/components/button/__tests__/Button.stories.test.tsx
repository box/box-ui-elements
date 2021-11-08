describe('components/button/Button', () => {
    test.each([['components-button--regular'], ['components-button--disabled']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
