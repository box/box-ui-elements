describe('features/shared-link-modal/SharedLinkModal', () => {
    const SHARED_LINK_MODAL_STORY = 'features-sharedlinkmodal--basic';
    test(`looks visually correct when using story ${SHARED_LINK_MODAL_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(SHARED_LINK_MODAL_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when button is clicked', async () => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(SHARED_LINK_MODAL_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
