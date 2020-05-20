describe('features/unified-share-modal/UnifiedShareModal', () => {
    const USF_STORY = 'features-unifiedsharemodal--with-form-only';

    test.each([
        'features-unifiedsharemodal--basic',
        'features-unifiedsharemodal--with-shared-link',
        'features-unifiedsharemodal--with-autofocused-shared-link',
        USF_STORY,
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each([
        'features-unifiedsharemodal--basic',
        'features-unifiedsharemodal--with-shared-link',
        'features-unifiedsharemodal--with-autofocused-shared-link',
    ])('looks visually correct when button is clicked in story %s', async id => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test(`looks visually correct when adding emails in story ${USF_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(USF_STORY, 'textarea', 'type', 's');
        return expect(image).toMatchImageSnapshot();
    });
});
