describe('components/fullscreen-flyout/FullscreenFlyout', () => {
    const STORIES = [
        'components-fullscreenflyout--basic',
        'components-fullscreenflyout--with-header',
        'components-fullscreenflyout--with-custom-close-on-click-elements',
    ];

    test.each(STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
