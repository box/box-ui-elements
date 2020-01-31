describe('features/shared-link-modal/SharedLink', () => {
    const SHARED_LINK_STORY = 'features-sharedlink--basic';
    test(`looks visually correct when using story ${SHARED_LINK_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(SHARED_LINK_STORY);
        expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when button is clicked', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(SHARED_LINK_STORY, 'button', 'click');
        expect(image).toMatchImageSnapshot();
    });
});
