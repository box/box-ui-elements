describe('components/media/Media', () => {
    const COLLAPSIBLE_STORIES = [
        'components-media-media--example',
        'components-media-media--with-nested-components',
        'components-media-media--with-form-elements',
    ];

    test.each(COLLAPSIBLE_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
