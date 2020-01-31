describe('components/radio/RadioButton', () => {
    test.each(['components-radio-radiobutton--basic', 'components-radio-radiobutton--disabled'])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
