describe('features/unified-share-modal/UnifiedShareModal', () => {
    const STORIES = [
        'features-unifiedsharemodal--basic',
        'features-unifiedsharemodal--with-shared-link',
        'features-unifiedsharemodal--with-autofocused-shared-link',
        'features-unifiedsharemodal--with-form-only',
    ];

    const MODAL_STORIES = [STORIES[0], STORIES[1], STORIES[2]];

    test.each(STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(MODAL_STORIES)('looks visually correct when button is clicked in story %s', async id => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test(`looks visually correct when adding emails in story ${STORIES[3]}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(STORIES[3], 'textarea', 'type', 's');
        return expect(image).toMatchImageSnapshot();
    });
});
