describe('components/close-button/CloseButton', () => {
    test.each(['components-buttons-closebutton'])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
