describe('components/select/Select', () => {
    test.each(['components-selectordropdown--basic'])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, '.SelectorDropdown input', 'focus');
        return expect(image).toMatchImageSnapshot();
    });
});
