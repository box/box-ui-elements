describe('components/accordion-collapsible/AccordionCollapsible', () => {
    const COLLAPSIBLE_STORIES = ['components-accordioncollapsible--regular'];

    test.each(COLLAPSIBLE_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(COLLAPSIBLE_STORIES)('collapses content for story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, '.accordion-collapsible-header-btn');
        return expect(image).toMatchImageSnapshot();
    });
});
