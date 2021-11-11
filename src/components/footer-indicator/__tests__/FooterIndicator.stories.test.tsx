describe('components/footer-indicator/FooterIndicator', () => {
    const STORIES = [['components-footerindicator--regular'], ['components-footerindicator--with-truncated-text']];
    test.each(STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(STORIES)('displays tooltip on hover for story %s', async id => {
        const page = await BoxVisualTestUtils.gotoStory(id);
        const footerIndicator = await page.$('.bdl-FooterIndicator');
        await footerIndicator?.hover();
        await page.waitForSelector('.tooltip-element');
        const image = await page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
