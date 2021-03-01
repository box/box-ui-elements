describe('components/section/Section', () => {
    const BASIC_SECTION_STORY = 'components-section--basic';

    test(`looks visually correct when using story ${BASIC_SECTION_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(BASIC_SECTION_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
