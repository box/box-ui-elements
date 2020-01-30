describe('components/tab-view/TabView', () => {
    const TABVIEW_STORIES = [
        'components-tabview--basic',
        'components-tabview--with-callback',
        'components-tabview--with-link',
        'components-tabview--dynamic',
        'components-tabview--dynamic-with-links',
    ];

    test.each(TABVIEW_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test(`shows new content after clicking on a new tab`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(TABVIEW_STORIES[0], '.tab[tabIndex="-1"]');
        await BoxVisualTestUtils.sleep(1000); // wait for tab animation to finish
        return expect(image).toMatchImageSnapshot();
    });
});
