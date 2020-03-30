describe('components/draft-js-editor/DraftJSEditor', () => {
    const DRAFT_JS_EDITOR_STORY = 'components-draftjseditor--basic';

    test(`looks visually correct when using story ${DRAFT_JS_EDITOR_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(DRAFT_JS_EDITOR_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when typing', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(
            DRAFT_JS_EDITOR_STORY,
            'div[contentEditable=true]',
            'type',
            'Cool ',
        );
        return expect(image).toMatchImageSnapshot();
    });
});
