describe('features/unified-share-modal/UnifiedShareModal', () => {
    const USM_STORIES = [
        'features-unifiedsharemodal--basic',
        'features-unifiedsharemodal--with-shared-link',
        'features-unifiedsharemodal--with-autofocused-shared-link',
    ];

    test.each(USM_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(USM_STORIES)('looks visually correct when button is clicked in story %s', async id => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
