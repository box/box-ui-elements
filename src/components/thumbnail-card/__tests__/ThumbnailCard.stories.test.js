describe('components/thumbnail-card/ThumbnailCard', () => {
    const THUMBNAIL_CARD_STORIES = ['components-thumbnailcard--basic', 'components-thumbnailcard--highlight-on-hover'];
    const selector = '.thumbnail-card';

    test.each(THUMBNAIL_CARD_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('should show a blue border when the card is hovered', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(THUMBNAIL_CARD_STORIES[1], selector, 'hover');
        return expect(image).toMatchImageSnapshot();
    });

    test('should show an orange border when the card is hovered and focused', async () => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${THUMBNAIL_CARD_STORIES[1]}`);
        await global.page.waitForSelector(selector);
        await global.page.hover(selector);
        await global.page.focus(selector);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
