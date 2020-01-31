describe('components/button-group/ButtonGroup', () => {
    test.each([['components-buttongroup--regular'], ['components-buttongroup--disabled']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
