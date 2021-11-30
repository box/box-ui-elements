describe('components/plain-button/PlainButton', () => {
    test.each(['components-buttons-plainbutton--regular', 'components-buttons-plainbutton--disabled'])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
