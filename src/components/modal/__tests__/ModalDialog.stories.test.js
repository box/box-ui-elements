describe('components/modal/ModalDialog', () => {
    const MODAL_DIALOG_STORY = 'components-modaldialog--basic';

    test(`looks visually correct when using story ${MODAL_DIALOG_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(MODAL_DIALOG_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
