describe('elements/content-explorer/ShareDialog', () => {
    const SHARE_DIALOG_STORY = 'elements-contentexplorer-sharedialog--share-dialog';

    test(`looks visually correct when using story ${SHARE_DIALOG_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(SHARE_DIALOG_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
