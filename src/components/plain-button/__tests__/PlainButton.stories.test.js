describe('components/plain-button/PlainButton', () => {
    test.each([['components-plainbutton--regular'], ['components-plainbutton--disabled']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await takeScreenshot(id);
            expect(image).toMatchImageSnapshot();
        },
    );
});
