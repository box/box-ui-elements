describe('components/full-screen-popover/FullScreenPopover', () => {
    const STORIES = [
        'components-fullscreenpopover--basic',
        'components-fullscreenpopover--with-custom-header',
        'components-fullscreenpopover--with-custom-close-on-click-elements',
    ];

    test.each(STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
