describe('components/collapsible/Collapsible', () => {
    const COLLAPSIBLE_STORIES = [
        'components-collapsible--with-border',
        'components-collapsible--without-border',
        'components-collapsible--with-button-in-header',
    ];

    test.each(COLLAPSIBLE_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(COLLAPSIBLE_STORIES)('collapses content for story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, '.collapsible-card-header');
        return expect(image).toMatchImageSnapshot();
    });
});
