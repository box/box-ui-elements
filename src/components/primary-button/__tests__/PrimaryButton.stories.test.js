describe('components/primary-button/PrimaryButton', () => {
    test.each([['components-primarybutton--regular'], ['components-primarybutton--disabled']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
