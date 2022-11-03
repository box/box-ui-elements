describe('components/draggable-list/DraggableList', () => {
    test.each([['components-draggablelist--example'], ['components-draggablelist--example-is-draggable-via-handle']])(
        `looks correct when using story %s`,
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
