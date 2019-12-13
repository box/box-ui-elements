describe('components/draft-js-editor/DraftJSEditor', () => {
    const DRAFT_JS_EDITOR_STORY = 'components-draftjseditor--basic';

    test(`looks visually correct when using story ${DRAFT_JS_EDITOR_STORY}`, async () => {
        const image = await takeScreenshot(DRAFT_JS_EDITOR_STORY);
        expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when typing', async () => {
        const image = await takeScreenshotAfterInput(
            DRAFT_JS_EDITOR_STORY,
            'div[contentEditable=true]',
            'type',
            'Cool ',
        );
        expect(image).toMatchImageSnapshot();
    });
});
