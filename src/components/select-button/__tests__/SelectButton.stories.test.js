describe('components/select-button/SelectButton', () => {
    test.each([['components-selectbutton--regular'], ['components-selectbutton--disabled']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await takeScreenshot(id);
            expect(image).toMatchImageSnapshot();
        },
    );
});
