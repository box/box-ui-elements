describe('components/fieldset/Fieldset', () => {
    const FIELDSET_STORY = 'components-fieldset--basic';
    test(`looks visually correct when using story ${FIELDSET_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(FIELDSET_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
