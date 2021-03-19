describe('components/draggable-list/DraggableList', () => {
    const DRAGGABLE_LIST_STORY = 'components-draggablelist--example';

    test(`looks correct when using story ${DRAGGABLE_LIST_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(DRAGGABLE_LIST_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
