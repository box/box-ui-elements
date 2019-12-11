describe('features/shared-link-modal/SharedLinkModal', () => {
    const SHARED_LINK_MODAL_STORY = 'components-sharedlinkmodal--basic';
    test(`looks visually correct when using story ${SHARED_LINK_MODAL_STORY}`, async () => {
        const image = await takeScreenshot(SHARED_LINK_MODAL_STORY);
        expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when button is clicked', async () => {
        const image = await takeScreenshotAfterInput(SHARED_LINK_MODAL_STORY, 'button');
        expect(image).toMatchImageSnapshot();
    });
});
