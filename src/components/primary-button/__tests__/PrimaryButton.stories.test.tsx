describe('components/primary-button/PrimaryButton', () => {
    test.each(['components-buttons-primarybutton--regular', 'components-buttons-primarybutton--disabled'])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
