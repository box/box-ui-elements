describe('components/modal/ModalActions', () => {
    const MODAL_ACTIONS_STORY = 'components-modalactions--basic';

    test(`looks visually correct when using story ${MODAL_ACTIONS_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(MODAL_ACTIONS_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
