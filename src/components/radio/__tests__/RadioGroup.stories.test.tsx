describe('components/radio/RadioButton', () => {
    const RADIOGROUP_STORY = 'components-radio-radiogroup--example';
    test(`looks visually correct when using story ${RADIOGROUP_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(RADIOGROUP_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('selects a radio button', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(RADIOGROUP_STORY, 'input[value="radio1"]');
        return expect(image).toMatchImageSnapshot();
    });
});
