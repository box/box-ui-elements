describe('features/shared-link-settings-modal/SharedLinkSettingsModal', () => {
    const SHARED_LINK_SETTINGS_MODAL_STORY = 'features-sharedlinksettingsmodal--basic';
    test(`looks visually correct when using story ${SHARED_LINK_SETTINGS_MODAL_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(SHARED_LINK_SETTINGS_MODAL_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when button is clicked', async () => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(SHARED_LINK_SETTINGS_MODAL_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
